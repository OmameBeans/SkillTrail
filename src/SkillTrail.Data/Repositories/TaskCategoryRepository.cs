using Microsoft.EntityFrameworkCore;
using SkillTrail.Biz.Entites;
using SkillTrail.Biz.Interfaces;
using SkillTrail.Data.DbContexts;

namespace SkillTrail.Data.Repositories
{
    public sealed class TaskCategoryRepository(SkillTrailDbContext dbContext) : ITaskCategoryRepository
    {
        private readonly SkillTrailDbContext _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));

        public async Task<bool> AddAsync(TaskCategory taskCategory)
        {
            try
            {
                var maxOrder = await _dbContext.TaskCategories.AnyAsync() ? await _dbContext.TaskCategories.MaxAsync(c => c.Order) : 0;
                taskCategory.Order = maxOrder + 1;
                await _dbContext.AddAsync(taskCategory);
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
                var category = await _dbContext.TaskCategories.FindAsync(id);
                if (category != null)
                {
                    _dbContext.TaskCategories.Remove(category);
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

        public async Task<IEnumerable<TaskCategory>> GetAsync()
        {
            var categories = await _dbContext.TaskCategories.OrderBy(tc => tc.Order).ToListAsync();
            return categories;
        }

        public async Task<TaskCategory?> GetAsync(string id)
        {
            var categories = _dbContext.TaskCategories;
            return await categories.FirstOrDefaultAsync(c => c.CategoryId == id);
        }

        public async Task<bool> UpdateAsync(TaskCategory taskCategory)
        {
            try
            {
                var existingCategory = await _dbContext.TaskCategories.FirstOrDefaultAsync(tc => tc.Id == taskCategory.Id);
                if (existingCategory != null)
                {
                    existingCategory.Title = taskCategory.Title;
                    existingCategory.Description = taskCategory.Description;
                    existingCategory.CategoryId = taskCategory.CategoryId;
                    existingCategory.UpdateDateTime = DateTime.Now;
                    existingCategory.UpdateUserId = taskCategory.UpdateUserId;
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

        public async Task<bool> ReorderAsync(IList<string> ids)
        {
            try
            {
                var categories = await _dbContext.TaskCategories.Where(c => ids.Contains(c.Id)).ToListAsync();
                if (categories.Count != ids.Count)
                {
                    return false;
                }
                for (int i = 0; i < ids.Count; i++)
                {
                    var category = categories.FirstOrDefault(c => c.Id == ids[i]);
                    if (category != null)
                    {
                        category.Order = i + 1;
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
