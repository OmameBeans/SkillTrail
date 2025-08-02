using SkillTrail.Biz.Interfaces;

namespace SkillTrail.Server
{
    public sealed class UserContextAdapter : IUserContext
    {
        public async Task<UserInfo> GetCurrentUserInfoAsync()
        {
            // モックユーザー情報を返す
            await Task.Delay(1); // 非同期処理をシミュレート
            
            return new UserInfo
            {
                Id = "manager"
            };
        }
    }
}
