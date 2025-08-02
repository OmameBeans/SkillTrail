using SkillTrail.Biz.Entites;
using SkillTrail.Biz.Interfaces;

namespace SkillTrail.Biz.ApplicationServices
{
    public sealed class UserApplicationService(IUserRepository userRepository, IUserContext userContext, IUserCsvImporter userCsvImporter)
    {
        private readonly IUserRepository _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
        private readonly IUserContext _userContext = userContext ?? throw new ArgumentNullException(nameof(userContext));
        private readonly IUserCsvImporter _userCsvImporter = userCsvImporter ?? throw new ArgumentNullException(nameof(userCsvImporter));

        public async Task<Result<User>> GetCurrentUserAsync()
        {
            var userInfo = await _userContext.GetCurrentUserInfoAsync();
            var user = await _userRepository.GetAsync(userInfo.Id);

            if (user == null)
            {
                var result = new Result<User>();
                result.ErrorMessages.Add("���݂̃��[�U�[��������܂���ł���");
                return result;
            }

            return new Result<User>(user);
        }

        public async Task<Result<IList<User>>> GetAsync()
        {
            var users = await _userRepository.GetAsync();
            return new Result<IList<User>>(users.OrderBy(u => u.Id).ToArray());
        }

        public async Task<Result<User>> GetAsync(string id)
        {
            var user = await _userRepository.GetAsync(id);
            if (user == null)
            {
                var result = new Result<User>();
                result.ErrorMessages.Add("���[�U�[��������܂���ł���");
                return result;
            }
            return new Result<User>(user);
        }

        public async Task<Result> CreateAsync(User user)
        {
            if (user == null)
            {
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
                UpdateDateTime = DateTime.Now,
                UpdateUserId = userInfo.Id,
            };

            if (await _userRepository.AddAsync(newUser))
            {
                return new Result();
            }
            else
            {
                var result = new Result();
                result.ErrorMessages.Add("���[�U�[�̍쐬�Ɏ��s���܂���");
                return result;
            }
        }

        public async Task<Result> UpdateAsync(User user)
        {
            if (user == null)
            {
                var result = new Result();
                result.ErrorMessages.Add("���[�U�[���ݒ肳��Ă��܂���");
                return result;
            }

            var userInfo = await _userContext.GetCurrentUserInfoAsync();
            user.UpdateDateTime = DateTime.Now;
            user.UpdateUserId = userInfo.Id;

            if (await _userRepository.UpdateAsync(user))
            {
                return new Result();
            }
            else
            {
                var result = new Result();
                result.ErrorMessages.Add("���[�U�[�̍X�V�Ɏ��s���܂���");
                return result;
            }
        }

        public async Task<Result> DeleteAsync(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                var result = new Result();
                result.ErrorMessages.Add("���[�U�[ID���ݒ肳��Ă��܂���");
                return result;
            }

            if (await _userRepository.DeleteAsync(id))
            {
                return new Result();
            }
            else
            {
                var result = new Result();
                result.ErrorMessages.Add("���[�U�[�̍폜�Ɏ��s���܂���");
                return result;
            }
        }

        public async Task<Result> ImportAsync(Stream stream, string fileName)
        {
            if (stream is null)
            {
                var result = new Result();
                result.ErrorMessages.Add("�C���|�[�g����t�@�C�����w�肳��Ă��܂���");
                return result;
            }

            try
            {
                var users = await _userCsvImporter.ImportAsync(stream, fileName);
                if (users == null || !users.Any())
                {
                    var result = new Result();
                    result.ErrorMessages.Add("�C���|�[�g���郆�[�U�[��������܂���ł���");
                    return result;
                }
                foreach (var user in users)
                {
                    user.UpdateDateTime = DateTime.Now;
                    user.UpdateUserId = (await _userContext.GetCurrentUserInfoAsync()).Id;
                }
                if (!await _userRepository.AddRangeAsync(users.ToArray()))
                {
                    var result = new Result();
                    result.ErrorMessages.Add("���[�U�[�̃C���|�[�g�Ɏ��s���܂���");
                    return result;
                }
                return new Result();
            }
            catch (Exception ex)
            {
                var result = new Result();
                result.ErrorMessages.Add($"���[�U�[�̃C���|�[�g���ɃG���[���������܂���: {ex.Message}");
                return result;
            }
        }
    }
}