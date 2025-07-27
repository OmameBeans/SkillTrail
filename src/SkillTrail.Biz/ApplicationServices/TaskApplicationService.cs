using SkillTrail.Biz.Entites;
using SkillTrail.Biz.Interfaces;
using Task = SkillTrail.Biz.Entites.Task;

namespace SkillTrail.Biz.ApplicationServices
{
    public sealed class TaskApplicationService
    {
        private readonly ITaskRepository _taskRepository;
        private readonly IUserContext _userContext;

        public TaskApplicationService(ITaskRepository taskRepository, IUserContext userContext)
        {
            _taskRepository = taskRepository ?? throw new ArgumentNullException(nameof(taskRepository));
            _userContext = userContext ?? throw new ArgumentNullException(nameof(userContext));
        }

        public Result<IList<Task>> Get()
        {
            var tasks = _taskRepository.Get();
            return new Result<IList<Task>>(tasks);
        }

        public Result<Task> Get(string id)
        {
            var task = _taskRepository.Get(id);
            if (task == null)
            {
                var result = new Result<Task>();
                result.ErrorMessages.Add("タスクが見つかりませんでした");
                return result;
            }
            return new Result<Task>(task);
        }

        public Result<IList<Task>> GetByCategoryId(string categoryId)
        {
            var tasks = _taskRepository.GetByCategoryId(categoryId);
            return new Result<IList<Task>>(tasks);
        }

        public Result Create(Task task)
        {
            if (task == null)
            {
                var result = new Result();
                result.ErrorMessages.Add("タスクが設定されていません");
                return result;
            }

            var userInfo = _userContext.GetCurrentUserInfo();

            var newTask = new Task
            {
                Id = Guid.NewGuid().ToString(),
                Title = task.Title,
                Description = task.Description,
                CategoryId = task.CategoryId,
                UpdateDateTime = DateTime.Now,
                UpdateUserId = userInfo.Id,
            };

            if (_taskRepository.Add(newTask))
            {
                return new Result();
            }
            else
            {
                var result = new Result();
                result.ErrorMessages.Add("タスクの作成に失敗しました");
                return result;
            }
        }

        public Result Update(Task task)
        {
            if (task == null)
            {
                var result = new Result();
                result.ErrorMessages.Add("タスクが設定されていません");
                return result;
            }

            var userInfo = _userContext.GetCurrentUserInfo();
            task.UpdateDateTime = DateTime.Now;
            task.UpdateUserId = userInfo.Id;

            if (_taskRepository.Update(task))
            {
                return new Result();
            }
            else
            {
                var result = new Result();
                result.ErrorMessages.Add("タスクの更新に失敗しました");
                return result;
            }
        }

        public Result Delete(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                var result = new Result();
                result.ErrorMessages.Add("タスクIDが設定されていません");
                return result;
            }
            if (_taskRepository.Delete(id))
            {
                return new Result();
            }
            else
            {
                var result = new Result();
                result.ErrorMessages.Add("タスクの削除に失敗しました");
                return result;
            }
        }

        public Result Reorder(string categoryId, IList<string> taskIds)
        {
            if (_taskRepository.Reorder(categoryId, taskIds))
            {
                return new Result();
            }
            else
            {
                var result = new Result();
                result.ErrorMessages.Add("タスクの並べ替えに失敗しました");
                return result;
            }
        }
    }
}
