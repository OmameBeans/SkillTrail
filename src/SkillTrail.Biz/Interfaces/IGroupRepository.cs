using SkillTrail.Biz.Entites;

namespace SkillTrail.Biz.Interfaces
{
    public interface IGroupRepository
    {
        Task<IEnumerable<Group>> GetAsync();
        Task<Group?> GetAsync(string id);
        Task<bool> AddAsync(Group group);
        Task<bool> UpdateAsync(Group group);
        Task<bool> DeleteAsync(string id);
    }
}
