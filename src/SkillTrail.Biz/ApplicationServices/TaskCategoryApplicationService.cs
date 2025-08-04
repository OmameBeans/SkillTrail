using SkillTrail.Biz.Entites;
using SkillTrail.Biz.Interfaces;

namespace SkillTrail.Biz.ApplicationServices
{
    public sealed class TaskCategoryApplicationService(ITaskCategoryRepository taskCategoryRepository, IUserContext userContext)
    {
        private readonly ITaskCategoryRepository _taskCategoryRepository = taskCategoryRepository ?? throw new ArgumentNullException(nameof(taskCategoryRepository));
        private readonly IUserContext _userContext = userContext ?? throw new ArgumentNullException(nameof(userContext));

        public async Task<Result<IList<TaskCategory>>> GetAsync()
        {
            var categories = await _taskCategoryRepository.GetAsync();
            return new Result<IList<TaskCategory>>(categories.ToArray());
        }

        public async Task<Result<TaskCategory>> GetAsync(string id)
        {
            var category = await _taskCategoryRepository.GetAsync(id);
            if (category == null)
            {
                var result = new Result<TaskCategory>();
                result.ErrorMessages.Add("タスクカテゴリが見つかりませんでした");
                return result;
            }
            return new Result<TaskCategory>(category);
        }

        public async Task<Result> CreateAsync(TaskCategory taskCategory)
        {
            if (taskCategory == null)
            {
                var result = new Result();
                result.ErrorMessages.Add("タスクカテゴリが設定されていません");
                return result;
            }

            var userInfo = await _userContext.GetCurrentUserInfoAsync();

            var newTaskCategory = new TaskCategory
            {
                Id = Guid.NewGuid().ToString(),
                Title = taskCategory.Title,
                Description = taskCategory.Description,
                CategoryId = taskCategory.CategoryId,
                UpdateDateTime = DateTime.Now,
                UpdateUserId = userInfo.Id,
            };

            if (await _taskCategoryRepository.AddAsync(newTaskCategory))
            {
                return new Result();
            }
            else
            {
                var result = new Result();
                result.ErrorMessages.Add("タスクカテゴリの作成に失敗しました");
                return result;
            }
        }

        public async Task<Result> UpdateAsync(TaskCategory taskCategory)
        {
            if (taskCategory == null)
            {
                var result = new Result();
                result.ErrorMessages.Add("タスクカテゴリが設定されていません");
                return result;
            }

            var userInfo = await _userContext.GetCurrentUserInfoAsync();
            taskCategory.UpdateDateTime = DateTime.Now;
            taskCategory.UpdateUserId = userInfo.Id;

            if (await _taskCategoryRepository.UpdateAsync(taskCategory))
            {
                return new Result();
            }
            else
            {
                var result = new Result();
                result.ErrorMessages.Add("タスクカテゴリの更新に失敗しました");
                return result;
            }
        }

        public async Task<Result> DeleteAsync(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                var result = new Result();
                result.ErrorMessages.Add("タスクカテゴリIDが設定されていません");
                return result;
            }
            if (await _taskCategoryRepository.DeleteAsync(id))
            {
                return new Result();
            }
            else
            {
                var result = new Result();
                result.ErrorMessages.Add("タスクカテゴリの削除に失敗しました");
                return result;
            }
        }

        public async Task<Result> ReorderAsync(IList<string> ids)
        {
            if (await _taskCategoryRepository.ReorderAsync(ids))
            {
                return new Result();
            }
            else
            {
                var result = new Result();
                result.ErrorMessages.Add("カテゴリの並べ替えに失敗しました");
                return result;
            }
        }
    }
}
