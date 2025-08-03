﻿using Microsoft.EntityFrameworkCore;
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
        public DbSet<Evaluation> Evaluations { get; set; }

        public SkillTrailDbContext(DbContextOptions<SkillTrailDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Evaluation>()
                .HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Evaluation>()
                .HasOne(e => e.Evaluator)
                .WithMany()
                .HasForeignKey(e => e.EvaluatorId)
                .OnDelete(DeleteBehavior.NoAction);

            base.OnModelCreating(modelBuilder);
        }
    }
}
