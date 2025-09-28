using SkillTrail.Biz.Interfaces;
using SkillTrail.Biz.Models;

namespace SkillTrail.Biz.ApplicationServices
{
    public class LevelApplicationService
    {
        private readonly IExperiencePointsProvider _experiencePointsProvider;
        private readonly int _maxLevel = 50;

        public LevelApplicationService(IExperiencePointsProvider experiencePointsProvider, int maxLevel)
        {
            _experiencePointsProvider = experiencePointsProvider;
            _maxLevel = maxLevel;
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
    }
}
