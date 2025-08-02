namespace SkillTrail.Biz.Interfaces
{
    public interface IUserContext
    {
        Task<UserInfo> GetCurrentUserInfoAsync();
    }

    public sealed class UserInfo
    {
        public string Id { get; set; } = string.Empty;
    }
}
