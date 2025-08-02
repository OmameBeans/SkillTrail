using Microsoft.EntityFrameworkCore;
using SkillTrail.Biz.Entites;
using SkillTrail.Biz.Interfaces;
using SkillTrail.Data.DbContexts;
using Task = SkillTrail.Biz.Entites.Task;

namespace SkillTrail.Data.Repositories
{
    public sealed class TaskRepository(SkillTrailDbContext dbContext) : ITaskRepository
    {
        private readonly SkillTrailDbContext _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));

        public async Task<bool> AddAsync(Task task)
        {
            try
            {
                var maxOrder = await _dbContext.Tasks.Where(t => t.CategoryId == task.CategoryId).AnyAsync()
                    ? await _dbContext.Tasks.Where(t => t.CategoryId == task.CategoryId).MaxAsync(t => t.Order)
                    : 0;
                task.Order = maxOrder + 1;
                await _dbContext.AddAsync(task);
                await _dbContext.SaveChangesAsync();

                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> DeleteAsync(string id)
        {
            try
            {
                var task = await _dbContext.Tasks.FindAsync(id);
                if (task != null)
                {
                    _dbContext.Tasks.Remove(task);
                    await _dbContext.SaveChangesAsync();
                    return true;
                }
            }
            catch
            {
                return false;
            }
            return false;
        }

        public async Task<IEnumerable<Task>> GetAsync()
        {
            var tasks = await _dbContext.Tasks.ToListAsync();
            return tasks;
        }

        public async Task<Task?> GetAsync(string id)
        {
            var task = await _dbContext.Tasks.FirstOrDefaultAsync(t => t.Id == id);
            return task;
        }

        public async Task<IEnumerable<Task>> GetByCategoryIdAsync(string categoryId)
        {
            var tasks = await _dbContext.Tasks.Where(t => t.CategoryId == categoryId)
                .OrderBy(t => t.Order)
                .ToListAsync();
            return tasks;
        }

        public async Task<bool> UpdateAsync(Task task)
        {
            try
            {
                var existingTask = await _dbContext.Tasks.FirstOrDefaultAsync(t => t.Id == task.Id);
                // categoryId‚ª•ÏX‚³‚ê‚éê‡‚É‚ÍOrder‚Í‚»‚ÌƒJƒeƒSƒŠ‚ÌMax+1‚Æ‚·‚é
                if (existingTask != null)
                {
                    existingTask.Title = task.Title;
                    existingTask.Description = task.Description;
                    if (existingTask.CategoryId != task.CategoryId)
                    {
                        var maxOrder = await _dbContext.Tasks.Where(t => t.CategoryId == task.CategoryId).AnyAsync()
                        ? await _dbContext.Tasks.Where(t => t.CategoryId == task.CategoryId).MaxAsync(t => t.Order)
                        : 0;
                        task.Order = maxOrder + 1;
                    }
                    existingTask.CategoryId = task.CategoryId;
                    existingTask.Order = task.Order;
                    existingTask.UpdateDateTime = DateTime.Now;
                    existingTask.UpdateUserId = task.UpdateUserId;
                    await _dbContext.SaveChangesAsync();
                    return true;
                }
            }
            catch
            {
                return false;
            }
            return false;
        }

        public async Task<bool> ReorderAsync(string categoryId, IList<string> taskIds)
        {
            try
            {
                var tasks = await _dbContext.Tasks.Where(t => t.CategoryId == categoryId && taskIds.Contains(t.Id)).ToListAsync();
                if (tasks.Count != taskIds.Count)
                {
                    return false;
                }
                for (int i = 0; i < taskIds.Count; i++)
                {
                    var task = tasks.FirstOrDefault(t => t.Id == taskIds[i]);
                    if (task != null)
                    {
                        task.Order = i + 1;
                    }
                }
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}