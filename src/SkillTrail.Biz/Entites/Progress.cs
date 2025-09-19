using SkillTrail.Biz.Abstractions;
using System.ComponentModel.DataAnnotations.Schema;

namespace SkillTrail.Biz.Entites
{
    public sealed class Progress : EntityBase
    {
        public string TaskId { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public ProgressStatus Status { get; set; } = ProgressStatus.None;
        public string Note { get; set; } = string.Empty;

        [ForeignKey(nameof(TaskId))]
        public Task Task { get; set; } = null!;

        [ForeignKey(nameof(UserId))]
        public User User { get; set; } = null!;
    }

    public enum ProgressStatus
    {
        None,
        NotStarted,
        InProgress,
        Completed,
    }
}
