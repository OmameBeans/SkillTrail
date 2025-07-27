namespace SkillTrail.Biz.Interfaces
{
    public interface IUserContext
    {
        UserInfo GetCurrentUserInfo();
    }

    public sealed class UserInfo
    {
        public string Id { get; set; } = string.Empty;
    }
}
