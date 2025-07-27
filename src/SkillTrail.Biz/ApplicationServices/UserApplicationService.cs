using SkillTrail.Biz.Entites;
using SkillTrail.Biz.Interfaces;

namespace SkillTrail.Biz.ApplicationServices
{
    public sealed class UserApplicationService(IUserRepository userRepository, IUserContext userContext)
    {
        private readonly IUserRepository _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
        private readonly IUserContext _userContext = userContext ?? throw new ArgumentNullException(nameof(userContext));

        public Result<User> GetCurrentUser()
        {
            var userInfo = _userContext.GetCurrentUserInfo();
            var user = _userRepository.Get(userInfo.Id);
            
            if (user == null)
            {
                var result = new Result<User>();
                result.ErrorMessages.Add("現在のユーザーが見つかりませんでした");
                return result;
            }
            
            return new Result<User>(user);
        }

        public Result<IList<User>> Get()
        {
            var users = _userRepository.Get();
            return new Result<IList<User>>(users);
        }

        public Result<User> Get(string id)
        {
            var user = _userRepository.Get(id);
            if (user == null)
            {
                var result = new Result<User>();
                result.ErrorMessages.Add("ユーザーが見つかりませんでした");
                return result;
            }
            return new Result<User>(user);
        }

        public Result Create(User user)
        {
            if (user == null)
            {
                var result = new Result();
                result.ErrorMessages.Add("ユーザーが設定されていません");
                return result;
            }

            var userInfo = _userContext.GetCurrentUserInfo();

            var newUser = new User
            {
                Id = Guid.NewGuid().ToString(),
                Name = user.Name,
                Role = user.Role,
                UpdateDateTime = DateTime.Now,
                UpdateUserId = userInfo.Id,
            };

            if (_userRepository.Add(newUser))
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

        public Result Update(User user)
        {
            if (user == null)
            {
                var result = new Result();
                result.ErrorMessages.Add("ユーザーが設定されていません");
                return result;
            }

            var userInfo = _userContext.GetCurrentUserInfo();
            user.UpdateDateTime = DateTime.Now;
            user.UpdateUserId = userInfo.Id;

            if (_userRepository.Update(user))
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

        public Result Delete(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                var result = new Result();
                result.ErrorMessages.Add("ユーザーIDが設定されていません");
                return result;
            }
            
            if (_userRepository.Delete(id))
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