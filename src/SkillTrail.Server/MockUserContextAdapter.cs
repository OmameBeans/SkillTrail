using SkillTrail.Biz.Interfaces;

namespace SkillTrail.Server
{
    public sealed class MockUserContextAdapter() : IUserContext
    {
        public Task<UserInfo> GetCurrentUserInfoAsync()
        {
            return Task.FromResult(new UserInfo { Id = "manager" });
        }
    }
}
