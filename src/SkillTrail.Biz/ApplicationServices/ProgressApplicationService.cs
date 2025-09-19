using SkillTrail.Biz.Entites;
using SkillTrail.Biz.Interfaces;

namespace SkillTrail.Biz.ApplicationServices
{
    public class ProgressApplicationService
    {
        private readonly IProgressRepository _progressRepository;
        private readonly IProgressQueryService _progressQueryService;
        private readonly IUserContext _userContext;

        public ProgressApplicationService(
            IProgressRepository progressRepository,
            IProgressQueryService progressQueryService,
            IUserContext userContext)
        {
            _progressRepository = progressRepository ?? throw new ArgumentNullException(nameof(progressRepository));
            _progressQueryService = progressQueryService ?? throw new ArgumentNullException(nameof(progressQueryService));
            _userContext = userContext ?? throw new ArgumentNullException(nameof(userContext));
        }

        /// <summary>
        /// ユーザーの進捗一覧を取得
        /// </summary>
        public async Task<Result<IList<ProgressQueryServiceModel>>> GetByUserIdAsync(string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                var result = new Result<IList<ProgressQueryServiceModel>>();
                result.ErrorMessages.Add("ユーザーIDが設定されていません");
                return result;
            }

            var progresses = await _progressQueryService.GetByUserIdAsync(userId);
            return new Result<IList<ProgressQueryServiceModel>>(progresses.ToArray());
        }

        /// <summary>
        /// 現在ログイン中のユーザーの進捗一覧を取得
        /// </summary>
        public async Task<Result<IList<ProgressQueryServiceModel>>> GetCurrentUserProgressAsync()
        {
            var userInfo = await _userContext.GetCurrentUserInfoAsync();
            return await GetByUserIdAsync(userInfo.Id);
        }

        /// <summary>
        /// 進捗を更新
        /// </summary>
        public async Task<Result> UpdateProgressAsync(string taskId, ProgressStatus status, string note)
        {
            if (string.IsNullOrEmpty(taskId))
            {
                var result = new Result();
                result.ErrorMessages.Add("タスクIDが設定されていません");
                return result;
            }

            var userInfo = await _userContext.GetCurrentUserInfoAsync();

            var existingProgress = await _progressRepository.GetByTaskIdAndUserIdAsync(taskId, userInfo.Id);

            var progress = new Progress();

            if (existingProgress is not null)
            {
                existingProgress.Status = status;
                existingProgress.Note = note;
                existingProgress.UpdateDateTime = DateTime.Now;
                existingProgress.UpdateUserId = userInfo.Id;
                progress = existingProgress;
            }
            else
            {
                progress = new Progress
                {
                    Id = Guid.NewGuid().ToString(),
                    TaskId = taskId,
                    UserId = userInfo.Id,
                    Status = status,
                    UpdateDateTime = DateTime.Now,
                    UpdateUserId = userInfo.Id,
                    Note = note,
                };
            }

            if (await _progressRepository.AddOrUpdateAsync(progress))
            {
                return new Result();
            }
            else
            {
                var result = new Result();
                result.ErrorMessages.Add("進捗の更新に失敗しました");
                return result;
            }
        }

        /// <summary>
        /// IDで進捗を取得
        /// </summary>
        public async Task<Result<Progress>> GetByIdAsync(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                var result = new Result<Progress>();
                result.ErrorMessages.Add("進捗IDが設定されていません");
                return result;
            }

            var progress = await _progressRepository.GetByIdAsync(id);
            if (progress == null)
            {
                var result = new Result<Progress>();
                result.ErrorMessages.Add("進捗が見つかりませんでした");
                return result;
            }

            return new Result<Progress>(progress);
        }
    }
}
