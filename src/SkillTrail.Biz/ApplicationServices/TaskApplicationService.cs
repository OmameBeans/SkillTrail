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

        public async Task<Result<IList<Task>>> GetAsync()
        {
            var tasks = await _taskRepository.GetAsync();
            return new Result<IList<Task>>(tasks.ToArray());
        }

        public async Task<Result<Task>> GetAsync(string id)
        {
            var task = await _taskRepository.GetAsync(id);
            if (task == null)
            {
                var result = new Result<Task>();
                result.ErrorMessages.Add("タスクが見つかりませんでした");
                return result;
            }
            return new Result<Task>(task);
        }

        public async Task<Result<IList<Task>>> GetByCategoryIdAsync(string categoryId)
        {
            var tasks = await _taskRepository.GetByCategoryIdAsync(categoryId);
            return new Result<IList<Task>>(tasks.ToArray());
        }

        public async Task<Result> CreateAsync(Task task)
        {
            if (task == null)
            {
                var result = new Result();
                result.ErrorMessages.Add("タスクが設定されていません");
                return result;
            }

            var userInfo = await _userContext.GetCurrentUserInfoAsync();

            var newTask = new Task
            {
                Id = Guid.NewGuid().ToString(),
                Title = task.Title,
                Description = task.Description,
                CategoryId = task.CategoryId,
                UpdateDateTime = DateTime.Now,
                UpdateUserId = userInfo.Id,
            };

            if (await _taskRepository.AddAsync(newTask))
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

        public async Task<Result> UpdateAsync(Task task)
        {
            if (task == null)
            {
                var result = new Result();
                result.ErrorMessages.Add("タスクが設定されていません");
                return result;
            }

            var userInfo = await _userContext.GetCurrentUserInfoAsync();
            task.UpdateDateTime = DateTime.Now;
            task.UpdateUserId = userInfo.Id;

            if (await _taskRepository.UpdateAsync(task))
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

        public async Task<Result> DeleteAsync(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                var result = new Result();
                result.ErrorMessages.Add("タスクIDが設定されていません");
                return result;
            }
            if (await _taskRepository.DeleteAsync(id))
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

        public async Task<Result> ReorderAsync(string categoryId, IList<string> taskIds)
        {
            if (await _taskRepository.ReorderAsync(categoryId, taskIds))
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
