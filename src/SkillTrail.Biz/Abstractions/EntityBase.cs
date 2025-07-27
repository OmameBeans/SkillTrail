using System.ComponentModel.DataAnnotations;

namespace SkillTrail.Biz.Abstractions
{
    public abstract class EntityBase
    {
        [Key]
        public string Id { get; set; } = string.Empty;
        public DateTime UpdateDateTime { get; set; } = DateTime.MinValue;
        public string UpdateUserId { get; set; } = string.Empty;
    }
}
