using SkillTrail.Biz.Interfaces;

namespace SkillTrail.Server
{
    public sealed class UserContextAdapter : IUserContext
    {
        public UserInfo GetCurrentUserInfo()
        {
            return new UserInfo
            {
                Id = "trainiee",
            };
        }
    }
}
