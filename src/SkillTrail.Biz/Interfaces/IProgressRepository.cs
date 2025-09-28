using SkillTrail.Biz.Entites;

namespace SkillTrail.Biz.Interfaces
{
    public interface IProgressRepository
    {
        Task<Progress?> GetByIdAsync(string id);
        Task<Progress?> GetByTaskIdAndUserIdAsync(string taskId, string userId);
        Task<IEnumerable<Progress>> GetByTaskIdAsync(string taskId);
        Task<IEnumerable<Progress>> GetByUserIdAsync(string userId);
        Task<bool> AddOrUpdateAsync(Progress progress);
    }
}
