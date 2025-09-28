using SkillTrail.Biz.Entites;
using Task = SkillTrail.Biz.Entites.Task;

namespace SkillTrail.Biz.Interfaces
{
    public interface ITaskRepository
    {
        Task<IEnumerable<Task>> GetAsync();
        Task<Task?> GetAsync(string id);
        Task<IEnumerable<Task>> GetAsync(IReadOnlyCollection<string> ids);
        Task<IEnumerable<Task>> GetByCategoryIdAsync(string categoryId);
        Task<bool> AddAsync(Task task);
        Task<bool> UpdateAsync(Task task);
        Task<bool> DeleteAsync(string id);
        Task<bool> ReorderAsync(string categoryId, IList<string> taskIds);
    }
}