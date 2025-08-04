using SkillTrail.Biz.Entites;

namespace SkillTrail.Biz.Interfaces
{
    public interface ITaskCategoryRepository
    {
        Task<IEnumerable<TaskCategory>> GetAsync();
        Task<TaskCategory?> GetAsync(string id);
        Task<bool> AddAsync(TaskCategory taskCategory);
        Task<bool> UpdateAsync(TaskCategory taskCategory);
        Task<bool> DeleteAsync(string id);
        Task<bool> ReorderAsync(IList<string> categoryIds);
    }
}
