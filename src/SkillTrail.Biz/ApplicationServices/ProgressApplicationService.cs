using Microsoft.Extensions.Logging;
using SkillTrail.Biz.Entites;
using SkillTrail.Biz.Interfaces;
using System.Security;

namespace SkillTrail.Biz.ApplicationServices
{
    public class ProgressApplicationService
    {
        private readonly IProgressRepository _progressRepository;
        private readonly IProgressQueryService _progressQueryService;
        private readonly IUserContext _userContext;
        private readonly ITransactionManager _transactionManager;
        private readonly IUserRepository _userRepository;
        private readonly ITaskRepository _taskRepository;
        private readonly IProgressExcelExporter _progressExcelExporter;
        private readonly IGroupRepository _groupRepository;
        private readonly IExperiencePointsProvider _experiencePointsProvider;
        private readonly ILogger<ProgressApplicationService> _logger;

        public ProgressApplicationService(
            IProgressRepository progressRepository,
            IProgressQueryService progressQueryService,
            IUserContext userContext,
            ITransactionManager transactionManager,
            IUserRepository userRepository,
            ILogger<ProgressApplicationService> logger,
            ITaskRepository taskRepository,
            IGroupRepository groupRepository,
            IProgressExcelExporter progressExcelExporter,
            IExperiencePointsProvider experiencePointsProvider)
        {
            _progressRepository = progressRepository ?? throw new ArgumentNullException(nameof(progressRepository));
            _progressQueryService = progressQueryService ?? throw new ArgumentNullException(nameof(progressQueryService));
            _userContext = userContext ?? throw new ArgumentNullException(nameof(userContext));
            _transactionManager = transactionManager ?? throw new ArgumentNullException(nameof(transactionManager));
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _taskRepository = taskRepository ?? throw new ArgumentNullException(nameof(taskRepository));
            _progressExcelExporter = progressExcelExporter ?? throw new ArgumentNullException(nameof(progressExcelExporter));
            _groupRepository = groupRepository ?? throw new ArgumentNullException(nameof(groupRepository));
            _experiencePointsProvider = experiencePointsProvider;
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
        public async Task<Result<UpdateProgressResult>> UpdateProgressAsync(string taskId, ProgressStatus status, string note)
        {
            if (string.IsNullOrEmpty(taskId))
            {
                var result = new Result<UpdateProgressResult>();
                result.ErrorMessages.Add("タスクIDが設定されていません");
                return result;
            }

            var userInfo = await _userContext.GetCurrentUserInfoAsync();

            var existingProgress = await _progressRepository.GetByTaskIdAndUserIdAsync(taskId, userInfo.Id);

            var task = await _taskRepository.GetAsync(taskId);

            var currentUser = await _userRepository.GetAsync(userInfo.Id);

            if (currentUser is null)
            {
                throw new Exception("現在ユーザーの取得に失敗しました");
            }

            var progress = new Progress();

            var prevStatus = existingProgress is null ? ProgressStatus.None : existingProgress.Status;
            var newStatus = status;
            var taskLevel = task?.Level ?? 0;
            long de = 0;
            if (prevStatus == ProgressStatus.Completed && newStatus != ProgressStatus.Completed) de = -(_experiencePointsProvider.GetExperiencePoints(taskLevel));
            else if (prevStatus != ProgressStatus.Completed && newStatus == ProgressStatus.Completed) de = _experiencePointsProvider.GetExperiencePoints(taskLevel);
            var prevLevel = _experiencePointsProvider.GetLevelFromExperiencePoints(Math.Max(0, currentUser.ExperiencePoints));
            var newLelvel = _experiencePointsProvider.GetLevelFromExperiencePoints(Math.Max(0, currentUser.ExperiencePoints + de));

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

            try
            {
                await _transactionManager.BeginAsync();
                if (await _progressRepository.AddOrUpdateAsync(progress) && await _userRepository.UpdateExperiencePoints(currentUser.Id, de))
                {
                    await _transactionManager.CommitAsync();
                    return new Result<UpdateProgressResult>()
                    {
                        Data = new UpdateProgressResult
                        {
                            PrevLevel = prevLevel,
                            NewLevel = newLelvel,
                        }
                    };
                }
                else
                {
                    await _transactionManager.RollbackAsync();
                    var result = new Result<UpdateProgressResult>();
                    result.ErrorMessages.Add("進捗の更新に失敗しました");
                    return result;
                }
            }
            catch
            {
                await _transactionManager.RollbackAsync();
                throw;
            }
        }

        public class UpdateProgressResult
        {
            public long PrevLevel { get; set; }
            public long NewLevel { get; set; }
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

        public async Task<Result<ExportProgressesToExcelResult>> ExportProgressesToExcelAsync(string groupId)
        {
            try
            {
                var traineesWithProgresses = await _userRepository.GetTraineesWithProgressesAsync(groupId) ?? [];
                var tasks = await _taskRepository.GetAsync() ?? [];
                var group = await _groupRepository.GetAsync(groupId);

                var groupName = string.Empty;
                if (string.IsNullOrEmpty(groupId)) groupName = "全ユーザー";
                else groupName = group?.Name ?? string.Empty;

                var stream = await _progressExcelExporter.ExportAsync(traineesWithProgresses.ToArray(), tasks.ToArray(), groupName);

                if (stream is null)
                {
                    var result = new Result<ExportProgressesToExcelResult>();
                    result.ErrorMessages.Add("進捗のエクスポートに失敗しました");
                    _logger.LogError("進捗のエクスポートに失敗: ストリームがnull");
                    return result;
                }

                return new Result<ExportProgressesToExcelResult>(new ExportProgressesToExcelResult
                {
                    Stream = stream,
                    GroupName = groupName,
                });
            }
            catch (Exception ex)
            {
                var result = new Result<ExportProgressesToExcelResult>();
                result.ErrorMessages.Add($"進捗のエクスポートに失敗しました: {ex.Message}");
                _logger.LogError(ex, "進捗のエクスポートに失敗");
                return result;
            }
        }

        public sealed class ExportProgressesToExcelResult
        {
            public Stream Stream { get; set; } = null!;
            public string GroupName { get; set; } = string.Empty;
        }
    }
}
