using SkillTrail.Biz.Abstractions;

namespace SkillTrail.Biz.Entites
{
    public sealed class User : EntityBase
    {
        public string Name { get; set; } = string.Empty;
        public Role Role { get; set; } = Role.None;
    }

    public enum Role
    {
        None,
        Trainee,
        Admin,
    }
}