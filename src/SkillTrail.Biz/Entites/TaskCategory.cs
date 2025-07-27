using SkillTrail.Biz.Abstractions;

namespace SkillTrail.Biz.Entites
{
    public class TaskCategory : EntityBase
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string CategoryId { get; set; } = string.Empty;
        public int Order { get; set; }

        public ICollection<Task> tasks { get; set; } = [];
    }
}
