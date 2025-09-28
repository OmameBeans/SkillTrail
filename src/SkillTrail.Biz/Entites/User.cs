using SkillTrail.Biz.Abstractions;
using System.ComponentModel.DataAnnotations.Schema;

namespace SkillTrail.Biz.Entites
{
    public sealed class User : EntityBase
    {
        public string Name { get; set; } = string.Empty;
        public Role Role { get; set; } = Role.None;
        public long ExperiencePoints { get; set; } = 0;

        public string? GroupId { get; set; }
        [ForeignKey(nameof(GroupId))]
        public Group? Group { get; set; }
        public ICollection<Progress> Progresses { get; set; } = [];
    }

    public enum Role
    {
        None,
        Trainee,
        Admin,
    }
}