using Microsoft.EntityFrameworkCore;
using SkillTrail.Biz.Entites;
using Task = SkillTrail.Biz.Entites.Task;

namespace SkillTrail.Data.DbContexts
{
    public class SkillTrailDbContext : DbContext
    {
        public DbSet<Task> Tasks { get; set; }
        public DbSet<TaskCategory> TaskCategories { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Progress> Progresses { get; set; }

        public SkillTrailDbContext(DbContextOptions<SkillTrailDbContext> options)
            : base(options)
        {
        }
    }
}
