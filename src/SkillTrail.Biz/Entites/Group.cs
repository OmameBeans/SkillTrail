using SkillTrail.Biz.Abstractions;

namespace SkillTrail.Biz.Entites
{
    public class Group : EntityBase
    {
        public string Name { get; set; } = string.Empty;

        public ICollection<User> Users { get; set; } = [];
    }
}
