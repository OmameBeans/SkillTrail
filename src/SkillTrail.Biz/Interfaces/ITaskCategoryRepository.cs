using SkillTrail.Biz.Entites;

namespace SkillTrail.Biz.Interfaces
{
    public interface ITaskCategoryRepository
    {
        IList<TaskCategory> Get();
        TaskCategory? Get(string id);
        bool Add(TaskCategory taskCategory);
        bool Update(TaskCategory taskCategory);
        bool Delete(string id);
        bool Reorder(IList<string> categoryIds);
    }
}
