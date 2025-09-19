using SkillTrail.Biz.Entites;
using SkillTrail.Biz.Interfaces;

namespace SkillTrail.IO.Importers
{
    public class UserCsvImporter : IUserCsvImporter
    {
        public async Task<IEnumerable<User>> ImportAsync(Stream stream, string fileName)
        {
            if (stream is null || stream.Length == 0)
            {
                throw new ArgumentNullException(nameof(stream), "ストリームが空です");
            }

            var users = new List<User>();

            using var reader = new StreamReader(stream);
            var headerLine = await reader.ReadLineAsync();

            if (string.IsNullOrEmpty(headerLine))
            {
                throw new InvalidOperationException("CSVファイルのヘッダーが空です");
            }

            var headers = headerLine.Split(',').Select(h => h.Trim()).ToArray();

            string? line;
            int lineNumber = 1;
            while ((line = await reader.ReadLineAsync()) != null)
            {
                if (string.IsNullOrWhiteSpace(line)) continue;

                try
                {
                    var user = ParseUserFromCsvLine(line, lineNumber);
                    if (user is not null)
                    {
                        users.Add(user);
                    }
                }
                catch (Exception ex)
                {
                    throw new InvalidOperationException($"行 {lineNumber} の解析中にエラーが発生しました: {ex.Message}", ex);
                }
                finally
                {
                    lineNumber++;
                }
            }

            return users;
        }

        private static User? ParseUserFromCsvLine(string line, int lineNumber)
        {
            var values = line.Split(',').Select(v => v.Trim().Trim('"')).ToArray();

            if (values.Length != 4)
                throw new InvalidOperationException($"列数が正しくありません。期待値: 4, 実際: {values.Length}");

            var id = values[0];
            var name = values[1];
            var groupId = values[2];
            var roleString = values[3];

            // バリデーション
            if (string.IsNullOrWhiteSpace(id))
                throw new InvalidOperationException("IDが空です");

            if (string.IsNullOrWhiteSpace(name))
                throw new InvalidOperationException("名前が空です");

            // Role enum の解析
            if (!Enum.TryParse<Role>(roleString, true, out var role))
                throw new InvalidOperationException($"無効なロール: '{roleString}'. 有効な値: {string.Join(", ", Enum.GetNames<Role>())}");

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
    }
}
