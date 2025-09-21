using Microsoft.Extensions.Logging;
using SkillTrail.Biz.Entites;
using SkillTrail.Biz.Interfaces;
using System.Security.Cryptography.X509Certificates;

namespace SkillTrail.Biz.ApplicationServices
{
    public sealed class UserApplicationService
    {
        private readonly IUserRepository _userRepository;
        private readonly IUserContext _userContext;
        private readonly IUserCsvImporter _userCsvImporter;
        private readonly IUserQueryService _userQueryService;
        private readonly ILogger<UserApplicationService> _logger;

        public UserApplicationService(
            IUserRepository userRepository,
            IUserContext userContext,
            IUserCsvImporter userCsvImporter,
            IUserQueryService userQueryService,
            ILogger<UserApplicationService> logger)
        {
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _userContext = userContext ?? throw new ArgumentNullException(nameof(userContext));
            _userCsvImporter = userCsvImporter ?? throw new ArgumentNullException(nameof(userCsvImporter));
            _userQueryService = userQueryService ?? throw new ArgumentNullException(nameof(userQueryService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<Result<User>> GetCurrentUserAsync()
        {
            try
            {
                _logger.LogInformation("現在のユーザー情報取得を開始");

                var userInfo = await _userContext.GetCurrentUserInfoAsync();
                _logger.LogInformation("現在のユーザー情報を取得: {UserId}", userInfo.Id);

                var user = await _userRepository.GetAsync(userInfo.Id);

                if (user == null)
                {
                    _logger.LogWarning("現在のユーザーが見つかりませんでした: {UserId}", userInfo.Id);
                    var result = new Result<User>();
                    result.ErrorMessages.Add("現在のユーザーが見つかりませんでした");
                    return result;
                }

                _logger.LogInformation("現在のユーザー情報を正常に取得: {UserId}, {UserName}", user.Id, user.Name);
                return new Result<User>(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "現在のユーザー情報取得中に例外が発生");
                throw;
            }
        }

        public async Task<Result<IList<UserQueryServiceModel>>> GetAsync()
        {
            try
            {
                _logger.LogInformation("ユーザー一覧取得を開始");

                var users = await _userQueryService.GetAsync();
                var orderedUsers = users.OrderBy(u => u.Id).ToArray();

                _logger.LogInformation("ユーザー一覧を取得: {UserCount}件", orderedUsers.Length);
                return new Result<IList<UserQueryServiceModel>>(orderedUsers);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ユーザー一覧取得中に例外が発生");
                throw;
            }
        }

        public async Task<Result<IList<User>>> GetTraineesWithProgressesAsync(string groupId)
        {
            try
            {
                _logger.LogInformation("新人一覧取得を開始");
                var users = await _userRepository.GetTraineesWithProgressesAsync(groupId);
                var orderedUsers = users.OrderBy(u => u.Id).ToArray();
                _logger.LogInformation("新人一覧を取得: {UserCount}件", orderedUsers.Length);
                return new Result<IList<User>>(orderedUsers);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "新人一覧取得中に例外が発生");
                throw;
            }
        }

        public async Task<Result<User>> GetAsync(string id)
        {
            try
            {
                _logger.LogInformation("ユーザー取得を開始: {UserId}", id);

                var user = await _userRepository.GetAsync(id);
                if (user == null)
                {
                    _logger.LogWarning("指定されたユーザーが見つかりませんでした: {UserId}", id);
                    var result = new Result<User>();
                    result.ErrorMessages.Add("ユーザーが見つかりませんでした");
                    return result;
                }

                _logger.LogInformation("ユーザーを正常に取得: {UserId}, {UserName}", user.Id, user.Name);
                return new Result<User>(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ユーザー取得中に例外が発生: {UserId}", id);
                throw;
            }
        }

        public async Task<Result> CreateAsync(User user)
        {
            try
            {
                _logger.LogInformation("ユーザー作成を開始: {UserId}, {UserName}", user?.Id, user?.Name);

                if (user == null)
                {
                    _logger.LogWarning("ユーザー作成でnullのユーザーが渡されました");
                    var result = new Result();
                    result.ErrorMessages.Add("ユーザーが設定されていません");
                    return result;
                }

                var userInfo = await _userContext.GetCurrentUserInfoAsync();

                var newUser = new User
                {
                    Id = user.Id,
                    Name = user.Name,
                    Role = user.Role,
                    GroupId = user.GroupId,
                    UpdateDateTime = DateTime.Now,
                    UpdateUserId = userInfo.Id,
                };

                if (await _userRepository.AddAsync(newUser))
                {
                    _logger.LogInformation("ユーザーを正常に作成: {UserId}, {UserName}", newUser.Id, newUser.Name);
                    return new Result();
                }
                else
                {
                    _logger.LogError("ユーザーの作成に失敗: {UserId}", user.Id);
                    var result = new Result();
                    result.ErrorMessages.Add("ユーザーの作成に失敗しました");
                    return result;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ユーザー作成中に例外が発生: {UserId}", user?.Id);
                throw;
            }
        }

        public async Task<Result> UpdateAsync(User user)
        {
            try
            {
                _logger.LogInformation("ユーザー更新を開始: {UserId}, {UserName}", user?.Id, user?.Name);

                if (user == null)
                {
                    _logger.LogWarning("ユーザー更新でnullのユーザーが渡されました");
                    var result = new Result();
                    result.ErrorMessages.Add("ユーザーが設定されていません");
                    return result;
                }

                var userInfo = await _userContext.GetCurrentUserInfoAsync();
                user.UpdateDateTime = DateTime.Now;
                user.UpdateUserId = userInfo.Id;

                if (await _userRepository.UpdateAsync(user))
                {
                    _logger.LogInformation("ユーザーを正常に更新: {UserId}, {UserName}", user.Id, user.Name);
                    return new Result();
                }
                else
                {
                    _logger.LogError("ユーザーの更新に失敗: {UserId}", user.Id);
                    var result = new Result();
                    result.ErrorMessages.Add("ユーザーの更新に失敗しました");
                    return result;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ユーザー更新中に例外が発生: {UserId}", user?.Id);
                throw;
            }
        }

        public async Task<Result> DeleteAsync(string id)
        {
            try
            {
                _logger.LogInformation("ユーザー削除を開始: {UserId}", id);

                if (string.IsNullOrEmpty(id))
                {
                    _logger.LogWarning("ユーザー削除で空のIDが渡されました");
                    var result = new Result();
                    result.ErrorMessages.Add("ユーザーIDが設定されていません");
                    return result;
                }

                if (await _userRepository.DeleteAsync(id))
                {
                    _logger.LogInformation("ユーザーを正常に削除: {UserId}", id);
                    return new Result();
                }
                else
                {
                    _logger.LogError("ユーザーの削除に失敗: {UserId}", id);
                    var result = new Result();
                    result.ErrorMessages.Add("ユーザーの削除に失敗しました");
                    return result;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ユーザー削除中に例外が発生: {UserId}", id);
                throw;
            }
        }

        public async Task<Result> ImportAsync(Stream stream, string fileName)
        {
            try
            {
                _logger.LogInformation("ユーザーCSVインポートを開始: {FileName}", fileName);

                if (stream is null)
                {
                    _logger.LogWarning("ユーザーインポートでnullのストリームが渡されました");
                    var result = new Result();
                    result.ErrorMessages.Add("インポートするファイルが指定されていません");
                    return result;
                }

                var users = await _userCsvImporter.ImportAsync(stream, fileName);
                if (users == null || !users.Any())
                {
                    _logger.LogWarning("インポート対象のユーザーが見つかりませんでした: {FileName}", fileName);
                    var result = new Result();
                    result.ErrorMessages.Add("インポートするユーザーが見つかりませんでした");
                    return result;
                }

                var userArray = users.ToArray();
                _logger.LogInformation("CSVから{UserCount}件のユーザーを読み込み: {FileName}", userArray.Length, fileName);

                var currentUser = await _userContext.GetCurrentUserInfoAsync();
                foreach (var user in userArray)
                {
                    user.UpdateDateTime = DateTime.Now;
                    user.UpdateUserId = currentUser.Id;
                }

                if (!await _userRepository.AddRangeAsync(userArray))
                {
                    _logger.LogError("ユーザーのインポートに失敗: {FileName}", fileName);
                    var result = new Result();
                    result.ErrorMessages.Add("ユーザーのインポートに失敗しました");
                    return result;
                }

                _logger.LogInformation("ユーザーCSVインポートが完了: {FileName}, {UserCount}件", fileName, userArray.Length);
                return new Result();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ユーザーCSVインポート中に例外が発生: {FileName}", fileName);
                var result = new Result();
                result.ErrorMessages.Add($"ユーザーのインポート中にエラーが発生しました: {ex.Message}");
                return result;
            }
        }
    }
}