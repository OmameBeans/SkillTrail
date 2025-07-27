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

        public bool Add(Task task)
        {
            try
            {
                var maxOrder = _dbContext.Tasks.Where(t => t.CategoryId == task.CategoryId).Any()
                    ? _dbContext.Tasks.Where(t => t.CategoryId == task.CategoryId).Max(t => t.Order)
                    : 0;
                task.Order = maxOrder + 1;
                _dbContext.Add(task);
                _dbContext.SaveChanges();

                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool Delete(string id)
        {
            try
            {
                var task = _dbContext.Tasks.Find(id);
                if (task != null)
                {
                    _dbContext.Tasks.Remove(task);
                    _dbContext.SaveChanges();
                    return true;
                }
            }
            catch
            {
                return false;
            }
            return false;
        }

        public IList<Task> Get()
        {
            var tasks = _dbContext.Tasks.ToList();
            return tasks;
        }

        public Task? Get(string id)
        {
            var task = _dbContext.Tasks.FirstOrDefault(t => t.Id == id);
            return task;
        }

        public IList<Task> GetByCategoryId(string categoryId)
        {
            var tasks = _dbContext.Tasks.Where(t => t.CategoryId == categoryId)
                .OrderBy(t => t.Order)
                .ToList();
            return tasks;
        }

        public bool Update(Task task)
        {
            try
            {
                var existingTask = _dbContext.Tasks.FirstOrDefault(t => t.Id == task.Id);
                // categoryId‚ª•ÏX‚³‚ê‚éê‡‚É‚ÍOrder‚Í‚»‚ÌƒJƒeƒSƒŠ‚ÌMax+1‚Æ‚·‚é
                if (existingTask != null)
                {
                    existingTask.Title = task.Title;
                    existingTask.Description = task.Description;
                    if (existingTask.CategoryId != task.CategoryId)
                    {
                        var maxOrder = _dbContext.Tasks.Where(t => t.CategoryId == task.CategoryId).Any()
                        ? _dbContext.Tasks.Where(t => t.CategoryId == task.CategoryId).Max(t => t.Order)
                        : 0;
                        task.Order = maxOrder + 1;
                    }
                    existingTask.CategoryId = task.CategoryId;
                    existingTask.Order = task.Order;
                    existingTask.UpdateDateTime = DateTime.Now;
                    existingTask.UpdateUserId = task.UpdateUserId;
                    _dbContext.SaveChanges();
                    return true;
                }
            }
            catch
            {
                return false;
            }
            return false;
        }

        public bool Reorder(string categoryId, IList<string> taskIds)
        {
            try
            {
                var tasks = _dbContext.Tasks.Where(t => t.CategoryId == categoryId && taskIds.Contains(t.Id)).ToList();
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
                _dbContext.SaveChanges();
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}