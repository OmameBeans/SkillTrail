using SkillTrail.Biz.Entites;
using Task = SkillTrail.Biz.Entites.Task;

namespace SkillTrail.Biz.Interfaces
{
    public interface IProgressExcelExporter
    {
        Task<Stream> ExportAsync(IReadOnlyCollection<User> trainees, IReadOnlyCollection<Task> tasks, string groupName);
    }
}
