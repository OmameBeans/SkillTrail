using SkillTrail.Biz.Entites;

namespace SkillTrail.Biz.Interfaces
{
    public interface IProgressRepository
    {
        Task<Progress?> GetByIdAsync(string id);
        Task<Progress?> GetByTaskIdAndUserIdAsync(string taskId, string userId);
        Task<bool> AddOrUpdateAsync(Progress progress);
    }
}
