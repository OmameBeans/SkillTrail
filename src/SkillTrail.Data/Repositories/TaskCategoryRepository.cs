using SkillTrail.Biz.Entites;
using SkillTrail.Biz.Interfaces;
using SkillTrail.Data.DbContexts;

namespace SkillTrail.Data.Repositories
{
    public sealed class TaskCategoryRepository(SkillTrailDbContext dbContext) : ITaskCategoryRepository
    {
        private readonly SkillTrailDbContext _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));

        public bool Add(TaskCategory taskCategory)
        {
            try
            {
                var maxOrder = _dbContext.TaskCategories.Any() ? _dbContext.TaskCategories.Max(c => c.Order) : 0;
                taskCategory.Order = maxOrder + 1;
                _dbContext.Add(taskCategory);
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
                var category = _dbContext.TaskCategories.Find(id);
                if (category != null)
                {
                    _dbContext.TaskCategories.Remove(category);
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

        public IList<TaskCategory> Get()
        {
            var categories = _dbContext.TaskCategories.OrderBy(tc => tc.Order).ToList();
            return categories;
        }

        public TaskCategory? Get(string id)
        {
            var categories = _dbContext.TaskCategories;
            return categories.FirstOrDefault(c => c.CategoryId == id);
        }

        public bool Update(TaskCategory taskCategory)
        {
            try
            {
                var existingCategory = _dbContext.TaskCategories.FirstOrDefault(tc => tc.Id == taskCategory.Id);
                if (existingCategory != null)
                {
                    existingCategory.Title = taskCategory.Title;
                    existingCategory.Description = taskCategory.Description;
                    existingCategory.CategoryId = taskCategory.CategoryId;
                    existingCategory.UpdateDateTime = DateTime.Now;
                    existingCategory.UpdateUserId = taskCategory.UpdateUserId;
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

        public bool Reorder(IList<string> ids)
        {
            try
            {
                var categories = _dbContext.TaskCategories.Where(c => ids.Contains(c.Id)).ToList();
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
