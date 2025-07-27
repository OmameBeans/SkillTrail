using SkillTrail.Biz.Entites;
using SkillTrail.Biz.Interfaces;

namespace SkillTrail.Biz.ApplicationServices
{
    public sealed class TaskCategoryApplicationService(ITaskCategoryRepository taskCategoryRepository, IUserContext userContext)
    {
        private readonly ITaskCategoryRepository _taskCategoryRepository = taskCategoryRepository ?? throw new ArgumentNullException(nameof(taskCategoryRepository));
        private readonly IUserContext _userContext = userContext ?? throw new ArgumentNullException(nameof(userContext));

        public Result<IList<TaskCategory>> Get()
        {
            var categories = _taskCategoryRepository.Get();
            return new Result<IList<TaskCategory>>(categories);
        }

        public Result<TaskCategory> Get(string id)
        {
            var category = _taskCategoryRepository.Get(id);
            if (category == null)
            {
                var result = new Result<TaskCategory>();
                result.ErrorMessages.Add("タスクカテゴリが見つかりませんでした");
                return result;
            }
            return new Result<TaskCategory>(category);
        }

        public Result Create(TaskCategory taskCategory)
        {
            if (taskCategory == null)
            {
                var result = new Result();
                result.ErrorMessages.Add("タスクカテゴリが設定されていません");
                return result;
            }

            var userInfo = _userContext.GetCurrentUserInfo();

            var newTaskCategory = new TaskCategory
            {
                Id = Guid.NewGuid().ToString(),
                Title = taskCategory.Title,
                Description = taskCategory.Description,
                CategoryId = taskCategory.CategoryId,
                UpdateDateTime = DateTime.Now,
                UpdateUserId = userInfo.Id,
            };

            if (_taskCategoryRepository.Add(newTaskCategory))
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

        public Result Update(TaskCategory taskCategory)
        {
            if (taskCategory == null)
            {
                var result = new Result();
                result.ErrorMessages.Add("タスクカテゴリが設定されていません");
                return result;
            }

            var userInfo = _userContext.GetCurrentUserInfo();
            taskCategory.UpdateDateTime = DateTime.Now;
            taskCategory.UpdateUserId = userInfo.Id;

            if (_taskCategoryRepository.Update(taskCategory))
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

        public Result Delete(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                var result = new Result();
                result.ErrorMessages.Add("タスクカテゴリIDが設定されていません");
                return result;
            }
            if (_taskCategoryRepository.Delete(id))
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

        public Result Reorder(IList<string> ids)
        {
            if (_taskCategoryRepository.Reorder(ids))
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
