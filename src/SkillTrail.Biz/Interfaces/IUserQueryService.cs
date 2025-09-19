using SkillTrail.Biz.Entites;

namespace SkillTrail.Biz.Interfaces
{
    public interface IUserQueryService
    {
        Task<IEnumerable<UserQueryServiceModel>> GetAsync();
        Task<UserQueryServiceModel?> GetAsync(string id);
        Task<IEnumerable<UserQueryServiceModel>> GetByGroupIdAsync(string groupId);
    }

    public class UserQueryServiceModel
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public Role Role { get; set; } = Role.None;
        public string? GroupId { get; set; }
        public string? GroupName { get; set; }
    }
}
