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
                result.ErrorMessages.Add("現在のユーザーが見つかりませんでした");
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
                result.ErrorMessages.Add("ユーザーが見つかりませんでした");
                return result;
            }
            return new Result<User>(user);
        }

        public async Task<Result> CreateAsync(User user)
        {
            if (user == null)
            {
                var result = new Result();
                result.ErrorMessages.Add("ユーザーが設定されていません");
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
                result.ErrorMessages.Add("ユーザーの作成に失敗しました");
                return result;
            }
        }

        public async Task<Result> UpdateAsync(User user)
        {
            if (user == null)
            {
                var result = new Result();
                result.ErrorMessages.Add("ユーザーが設定されていません");
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
                result.ErrorMessages.Add("ユーザーの更新に失敗しました");
                return result;
            }
        }

        public async Task<Result> DeleteAsync(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                var result = new Result();
                result.ErrorMessages.Add("ユーザーIDが設定されていません");
                return result;
            }
            
            if (await _userRepository.DeleteAsync(id))
            {
                return new Result();
            }
            else
            {
                var result = new Result();
                result.ErrorMessages.Add("ユーザーの削除に失敗しました");
                return result;
            }
        }
    }
}