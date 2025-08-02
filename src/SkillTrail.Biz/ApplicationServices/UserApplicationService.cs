using SkillTrail.Biz.Entites;
using SkillTrail.Biz.Interfaces;

namespace SkillTrail.Biz.ApplicationServices
{
    public sealed class UserApplicationService(IUserRepository userRepository, IUserContext userContext)
    {
        private readonly IUserRepository _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
        private readonly IUserContext _userContext = userContext ?? throw new ArgumentNullException(nameof(userContext));

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
            return new Result<IList<User>>(users.ToArray());
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
                Id = Guid.NewGuid().ToString(),
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
    }
}