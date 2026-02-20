using SkillTrail.Biz.Abstractions;

namespace SkillTrail.Biz.Entites
{
    public class Feedback : EntityBase
    {
        public string UserId { get; set; } = string.Empty;
        public string Comment { get; set; } = string.Empty;
    }
}
