using SkillTrail.Biz.Entites;
using SkillTrail.Biz.Interfaces;
using SkillTrail.Biz.Models;

namespace SkillTrail.Biz.ApplicationServices
{
    public class LevelApplicationService
    {
        private readonly IExperiencePointsProvider _experiencePointsProvider;
        private readonly IUserContext _userContext;
        private readonly IProgressRepository _progressRepository;
        private readonly ITaskRepository _taskRepository;
        private readonly int _maxLevel = 50;

        public LevelApplicationService(IExperiencePointsProvider experiencePointsProvider, int maxLevel, IUserContext userContext, IProgressRepository progressRepository, ITaskRepository taskRepository)
        {
            _experiencePointsProvider = experiencePointsProvider;
            _maxLevel = maxLevel;
            _userContext = userContext;
            _progressRepository = progressRepository;
            _taskRepository = taskRepository;
        }

        public Result<List<LevelEntry>> GetLevels()
        {
            var list = new List<LevelEntry>();
            for (int level = 1; level <= _maxLevel; level++)
            {
                list.Add(new LevelEntry
                {
                    Level = level,
                    ExperiencePoints = _experiencePointsProvider.GetExperiencePoints(level),
                    CumulativeExperiencePoints = _experiencePointsProvider.GetCumulativeExperiencePoints(level)
                });
            }
            return new Result<List<LevelEntry>>(list);
        }

        public async Task<Result<GetUserLevelResult>> GetCurrentUserLevelAsync()
        {
            var result = new Result<GetUserLevelResult>();
            var userInfo = _userContext.GetCurrentUserInfoAsync().Result;
            if (userInfo == null)
            {
                result.ErrorMessages.Add("ユーザー情報が取得できませんでした");
                return result;
            }
            var progresses = await _progressRepository.GetByUserIdAsync(userInfo.Id);
            var completedTaskIds = progresses.Where(p => p.Status == ProgressStatus.Completed).Select(p => p.TaskId);
            var tasks = await _taskRepository.GetAsync(completedTaskIds.ToArray());
            var taskLevels = tasks.Select(t => t.Level);
            var currentLevel = _experiencePointsProvider.GetLevelFromLevels(taskLevels.ToArray());
            long currentExp = 0;
            foreach(var level in taskLevels)
            {
                currentExp += _experiencePointsProvider.GetExperiencePoints(level);
            }
            var nextLevelExp = currentLevel < _maxLevel ? _experiencePointsProvider.GetCumulativeExperiencePoints(currentLevel + 1) : currentExp;

            result.Data = new GetUserLevelResult
            {
                Level = currentLevel,
                CurrentExperiencePoints = currentExp,
                NextLevelExperiencePoints = nextLevelExp
            };

            return result;
        }
    }

    public class GetUserLevelResult
    {
        public int Level { get; set; }
        public long CurrentExperiencePoints { get; set; }
        public long NextLevelExperiencePoints { get; set; }
    }
}
