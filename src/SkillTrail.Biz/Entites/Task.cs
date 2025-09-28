using SkillTrail.Biz.Abstractions;
using System.ComponentModel.DataAnnotations.Schema;

namespace SkillTrail.Biz.Entites
{
    public sealed class Task : EntityBase
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string CategoryId { get; set; } = string.Empty;
        public int Level { get; set; }
        public int Order { get; set; }

        [ForeignKey(nameof(CategoryId))]
        public TaskCategory? Category { get; set; }
    }
}
