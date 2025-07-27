using SkillTrail.Biz.Entites;
using Task = SkillTrail.Biz.Entites.Task;

namespace SkillTrail.Biz.Interfaces
{
    public interface ITaskRepository
    {
        IList<Task> Get();
        Task? Get(string id);
        IList<Task> GetByCategoryId(string categoryId);
        bool Add(Task task);
        bool Update(Task task);
        bool Delete(string id);
        bool Reorder(string categoryId, IList<string> taskIds);
    }
}