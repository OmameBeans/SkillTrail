using Microsoft.EntityFrameworkCore;
using SkillTrail.Biz.Interfaces;
using SkillTrail.Data.DbContexts;

namespace SkillTrail.Data.QueryServices
{
    public class ProgressQueryService : IProgressQueryService
    {
        private readonly SkillTrailDbContext _dbContext;

        public ProgressQueryService(SkillTrailDbContext dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        public async Task<IEnumerable<ProgressQueryServiceModel>> GetByUserIdAsync(string userId)
        {
            var query = from task in _dbContext.Tasks
                        join progress in _dbContext.Progresses
                            on new { TaskId = task.Id, UserId = userId } equals new { TaskId = progress.TaskId, UserId = progress.UserId }
                            into progressGroup
                        from progress in progressGroup.DefaultIfEmpty()
                        join category in _dbContext.TaskCategories
                            on task.CategoryId equals category.Id
                        orderby category.Order, task.Order
                        select new ProgressQueryServiceModel
                        {
                            Id = progress != null ? progress.Id : string.Empty,
                            TaskId = task.Id,
                            Level = task.Level,
                            TaskName = $"{task.Title}",
                            UserId = userId,
                            Status = progress != null ? progress.Status : Biz.Entites.ProgressStatus.NotStarted,
                            Note = progress != null ? progress.Note : string.Empty,
                        };

            return await query.ToListAsync();
        }
    }
}
