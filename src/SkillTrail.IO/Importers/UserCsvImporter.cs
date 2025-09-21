using Microsoft.Extensions.Logging;
using SkillTrail.Biz.Entites;
using SkillTrail.Biz.Interfaces;

namespace SkillTrail.IO.Importers
{
    public class UserCsvImporter : IUserCsvImporter
    {
        private readonly ILogger<UserCsvImporter> _logger;

        public UserCsvImporter(ILogger<UserCsvImporter> logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<IEnumerable<User>> ImportAsync(Stream stream, string fileName)
        {
            _logger.LogInformation("CSVインポート処理開始: {FileName}", fileName);
            
            if (stream is null || stream.Length == 0)
            {
                _logger.LogError("CSVインポートで空のストリームが渡されました: {FileName}", fileName);
                throw new ArgumentNullException(nameof(stream), "ストリームが空です");
            }

            var users = new List<User>();

            try
            {
                using var reader = new StreamReader(stream);
                var headerLine = await reader.ReadLineAsync();

                if (string.IsNullOrEmpty(headerLine))
                {
                    _logger.LogError("CSVファイルのヘッダーが空です: {FileName}", fileName);
                    throw new InvalidOperationException("CSVファイルのヘッダーが空です");
                }

                _logger.LogDebug("CSVヘッダー読み込み完了: {Header}", headerLine);
                var headers = headerLine.Split(',').Select(h => h.Trim()).ToArray();

                string? line;
                int lineNumber = 1;
                int processedCount = 0;
                
                while ((line = await reader.ReadLineAsync()) != null)
                {
                    if (string.IsNullOrWhiteSpace(line)) 
                    {
                        _logger.LogDebug("空行をスキップ: 行 {LineNumber}", lineNumber);
                        continue;
                    }

                    try
                    {
                        var user = ParseUserFromCsvLine(line, lineNumber);
                        if (user is not null)
                        {
                            users.Add(user);
                            processedCount++;
                            _logger.LogDebug("ユーザー解析完了: 行 {LineNumber}, ID: {UserId}, 名前: {UserName}", 
                                lineNumber, user.Id, user.Name);
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "行 {LineNumber} の解析中にエラーが発生: {Line}", lineNumber, line);
                        throw new InvalidOperationException($"行 {lineNumber} の解析中にエラーが発生しました: {ex.Message}", ex);
                    }
                    finally
                    {
                        lineNumber++;
                    }
                }

                _logger.LogInformation("CSVインポート処理完了: {FileName}, 処理済み {ProcessedCount}件, 総行数 {TotalLines}行", 
                    fileName, processedCount, lineNumber - 1);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "CSVインポート処理中に例外が発生: {FileName}", fileName);
                throw;
            }

            return users;
        }

        private User? ParseUserFromCsvLine(string line, int lineNumber)
        {
            try
            {
                var values = line.Split(',').Select(v => v.Trim().Trim('"')).ToArray();

                if (values.Length != 4)
                {
                    _logger.LogWarning("行 {LineNumber}: 列数が正しくありません。期待値: 4, 実際: {ActualCount}", 
                        lineNumber, values.Length);
                    throw new InvalidOperationException($"列数が正しくありません。期待値: 4, 実際: {values.Length}");
                }

                var id = values[0];
                var name = values[1];
                var groupId = values[2] == string.Empty ? null : values[2];
                var roleString = values[3];

                // バリデーション
                if (string.IsNullOrWhiteSpace(id))
                {
                    _logger.LogWarning("行 {LineNumber}: IDが空です", lineNumber);
                    throw new InvalidOperationException("IDが空です");
                }

                if (string.IsNullOrWhiteSpace(name))
                {
                    _logger.LogWarning("行 {LineNumber}: 名前が空です", lineNumber);
                    throw new InvalidOperationException("名前が空です");
                }

                // Role enum の解析
                if (!Enum.TryParse<Role>(roleString, true, out var role))
                {
                    _logger.LogWarning("行 {LineNumber}: 無効なロール '{Role}'", lineNumber, roleString);
                    throw new InvalidOperationException($"無効なロール: '{roleString}'. 有効な値: {string.Join(", ", Enum.GetNames<Role>())}");
                }

                return new User
                {
                    Id = id,
                    Name = name,
                    GroupId = groupId,
                    Role = role,
                    UpdateDateTime = DateTime.Now,
                    UpdateUserId = string.Empty // ApplicationServiceで設定される
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "行 {LineNumber} の解析でエラー: {Line}", lineNumber, line);
                throw;
            }
        }
    }
}
