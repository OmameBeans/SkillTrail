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
                _logger.LogInformation("���݂̃��[�U�[���擾���J�n");

                var userInfo = await _userContext.GetCurrentUserInfoAsync();
                _logger.LogInformation("���݂̃��[�U�[�����擾: {UserId}", userInfo.Id);

                var user = await _userRepository.GetAsync(userInfo.Id);

                if (user == null)
                {
                    _logger.LogWarning("���݂̃��[�U�[��������܂���ł���: {UserId}", userInfo.Id);
                    var result = new Result<User>();
                    result.ErrorMessages.Add("���݂̃��[�U�[��������܂���ł���");
                    return result;
                }

                _logger.LogInformation("���݂̃��[�U�[���𐳏�Ɏ擾: {UserId}, {UserName}", user.Id, user.Name);
                return new Result<User>(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "���݂̃��[�U�[���擾���ɗ�O������");
                throw;
            }
        }

        public async Task<Result<IList<UserQueryServiceModel>>> GetAsync()
        {
            try
            {
                _logger.LogInformation("���[�U�[�ꗗ�擾���J�n");

                var users = await _userQueryService.GetAsync();
                var orderedUsers = users.OrderBy(u => u.Id).ToArray();

                _logger.LogInformation("���[�U�[�ꗗ���擾: {UserCount}��", orderedUsers.Length);
                return new Result<IList<UserQueryServiceModel>>(orderedUsers);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "���[�U�[�ꗗ�擾���ɗ�O������");
                throw;
            }
        }

        public async Task<Result<IList<User>>> GetTraineesWithProgressesAsync(string groupId)
        {
            try
            {
                _logger.LogInformation("�V�l�ꗗ�擾���J�n");
                var users = await _userRepository.GetTraineesWithProgressesAsync(groupId);
                var orderedUsers = users.OrderBy(u => u.Id).ToArray();
                _logger.LogInformation("�V�l�ꗗ���擾: {UserCount}��", orderedUsers.Length);
                return new Result<IList<User>>(orderedUsers);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "�V�l�ꗗ�擾���ɗ�O������");
                throw;
            }
        }

        public async Task<Result<User>> GetAsync(string id)
        {
            try
            {
                _logger.LogInformation("���[�U�[�擾���J�n: {UserId}", id);

                var user = await _userRepository.GetAsync(id);
                if (user == null)
                {
                    _logger.LogWarning("�w�肳�ꂽ���[�U�[��������܂���ł���: {UserId}", id);
                    var result = new Result<User>();
                    result.ErrorMessages.Add("���[�U�[��������܂���ł���");
                    return result;
                }

                _logger.LogInformation("���[�U�[�𐳏�Ɏ擾: {UserId}, {UserName}", user.Id, user.Name);
                return new Result<User>(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "���[�U�[�擾���ɗ�O������: {UserId}", id);
                throw;
            }
        }

        public async Task<Result> CreateAsync(User user)
        {
            try
            {
                _logger.LogInformation("���[�U�[�쐬���J�n: {UserId}, {UserName}", user?.Id, user?.Name);

                if (user == null)
                {
                    _logger.LogWarning("���[�U�[�쐬��null�̃��[�U�[���n����܂���");
                    var result = new Result();
                    result.ErrorMessages.Add("���[�U�[���ݒ肳��Ă��܂���");
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
                    _logger.LogInformation("���[�U�[�𐳏�ɍ쐬: {UserId}, {UserName}", newUser.Id, newUser.Name);
                    return new Result();
                }
                else
                {
                    _logger.LogError("���[�U�[�̍쐬�Ɏ��s: {UserId}", user.Id);
                    var result = new Result();
                    result.ErrorMessages.Add("���[�U�[�̍쐬�Ɏ��s���܂���");
                    return result;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "���[�U�[�쐬���ɗ�O������: {UserId}", user?.Id);
                throw;
            }
        }

        public async Task<Result> UpdateAsync(User user)
        {
            try
            {
                _logger.LogInformation("���[�U�[�X�V���J�n: {UserId}, {UserName}", user?.Id, user?.Name);

                if (user == null)
                {
                    _logger.LogWarning("���[�U�[�X�V��null�̃��[�U�[���n����܂���");
                    var result = new Result();
                    result.ErrorMessages.Add("���[�U�[���ݒ肳��Ă��܂���");
                    return result;
                }

                var userInfo = await _userContext.GetCurrentUserInfoAsync();
                user.UpdateDateTime = DateTime.Now;
                user.UpdateUserId = userInfo.Id;

                if (await _userRepository.UpdateAsync(user))
                {
                    _logger.LogInformation("���[�U�[�𐳏�ɍX�V: {UserId}, {UserName}", user.Id, user.Name);
                    return new Result();
                }
                else
                {
                    _logger.LogError("���[�U�[�̍X�V�Ɏ��s: {UserId}", user.Id);
                    var result = new Result();
                    result.ErrorMessages.Add("���[�U�[�̍X�V�Ɏ��s���܂���");
                    return result;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "���[�U�[�X�V���ɗ�O������: {UserId}", user?.Id);
                throw;
            }
        }

        public async Task<Result> DeleteAsync(string id)
        {
            try
            {
                _logger.LogInformation("���[�U�[�폜���J�n: {UserId}", id);

                if (string.IsNullOrEmpty(id))
                {
                    _logger.LogWarning("���[�U�[�폜�ŋ��ID���n����܂���");
                    var result = new Result();
                    result.ErrorMessages.Add("���[�U�[ID���ݒ肳��Ă��܂���");
                    return result;
                }

                if (await _userRepository.DeleteAsync(id))
                {
                    _logger.LogInformation("���[�U�[�𐳏�ɍ폜: {UserId}", id);
                    return new Result();
                }
                else
                {
                    _logger.LogError("���[�U�[�̍폜�Ɏ��s: {UserId}", id);
                    var result = new Result();
                    result.ErrorMessages.Add("���[�U�[�̍폜�Ɏ��s���܂���");
                    return result;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "���[�U�[�폜���ɗ�O������: {UserId}", id);
                throw;
            }
        }

        public async Task<Result> ImportAsync(Stream stream, string fileName)
        {
            try
            {
                _logger.LogInformation("���[�U�[CSV�C���|�[�g���J�n: {FileName}", fileName);

                if (stream is null)
                {
                    _logger.LogWarning("���[�U�[�C���|�[�g��null�̃X�g���[�����n����܂���");
                    var result = new Result();
                    result.ErrorMessages.Add("�C���|�[�g����t�@�C�����w�肳��Ă��܂���");
                    return result;
                }

                var users = await _userCsvImporter.ImportAsync(stream, fileName);
                if (users == null || !users.Any())
                {
                    _logger.LogWarning("�C���|�[�g�Ώۂ̃��[�U�[��������܂���ł���: {FileName}", fileName);
                    var result = new Result();
                    result.ErrorMessages.Add("�C���|�[�g���郆�[�U�[��������܂���ł���");
                    return result;
                }

                var userArray = users.ToArray();
                _logger.LogInformation("CSV����{UserCount}���̃��[�U�[��ǂݍ���: {FileName}", userArray.Length, fileName);

                var currentUser = await _userContext.GetCurrentUserInfoAsync();
                foreach (var user in userArray)
                {
                    user.UpdateDateTime = DateTime.Now;
                    user.UpdateUserId = currentUser.Id;
                }

                if (!await _userRepository.AddRangeAsync(userArray))
                {
                    _logger.LogError("���[�U�[�̃C���|�[�g�Ɏ��s: {FileName}", fileName);
                    var result = new Result();
                    result.ErrorMessages.Add("���[�U�[�̃C���|�[�g�Ɏ��s���܂���");
                    return result;
                }

                _logger.LogInformation("���[�U�[CSV�C���|�[�g������: {FileName}, {UserCount}��", fileName, userArray.Length);
                return new Result();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "���[�U�[CSV�C���|�[�g���ɗ�O������: {FileName}", fileName);
                var result = new Result();
                result.ErrorMessages.Add($"���[�U�[�̃C���|�[�g���ɃG���[���������܂���: {ex.Message}");
                return result;
            }
        }
    }
}