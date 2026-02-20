using SkillTrail.Biz.Entites;

namespace SkillTrail.Biz.Interfaces
{
    public interface IProgressQueryService
    {
    Task<IEnumerable<ProgressQueryServiceModel>> GetByUserIdAsync(string userId, string? categoryId = null);
    }

    public class ProgressQueryServiceModel
    {
        public string Id { get; set; } = string.Empty;
        public string TaskId { get; set; } = string.Empty;
        public int Level { get; set; }
        public string TaskName { get; set; } = string.Empty;
        public string TaskDescription { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public ProgressStatus Status { get; set; } = ProgressStatus.None;
        public string Note { get; set; } = string.Empty;
    }
}
