using SkillTrail.Biz.Interfaces;

namespace SkillTrail.Biz.Providers
{
    public class ExperiencePointsProvider : IExperiencePointsProvider
    {
        private readonly long _initialCost;
        private readonly double _a;
        private readonly int _maxLevel = 50;
        private readonly List<long> _experiencePointsCache = [];
        private readonly List<long> _cumulativeExperiencePointsCache = [];

        public ExperiencePointsProvider(long InitialCost, double a, int maxLevel)
        {
            _initialCost = InitialCost;
            _a = a;
            _maxLevel = maxLevel;

            long current = _initialCost;
            long tot = current;
            _experiencePointsCache.Add(0);
            _experiencePointsCache.Add(_initialCost);

            _cumulativeExperiencePointsCache.Add(0);
            _cumulativeExperiencePointsCache.Add(0);

            for (int level = 1; level <= _maxLevel; level++)
            {
                current = (long)(current * _a);
                _experiencePointsCache.Add(current);
                _cumulativeExperiencePointsCache.Add(tot);
                tot += current;
            }
        }

        /// <summary>
        /// レベルに到達するまでに必要な累積経験値を取得します。
        /// </summary>
        /// <param name="level"></param>
        /// <returns></returns>
        public long GetCumulativeExperiencePoints(int level)
        {
            return _cumulativeExperiencePointsCache[level];
        }

        /// <summary>
        /// 指定したレベルで得られる経験値を取得します。
        /// </summary>
        /// <param name="level"></param>
        /// <returns></returns>
        public long GetExperiencePoints(int level)
        {
            return _experiencePointsCache[level];
        }

        public long GetLevelFromExperiencePoints(long experiencePoints)
        {
            if (experiencePoints <= 0) return 1;

            for (int level = 0; level < _cumulativeExperiencePointsCache.Count; level++)
            {
                if (experiencePoints < _cumulativeExperiencePointsCache[level])
                {
                    return level - 1;
                }
            }
            return _maxLevel;
        }
    }
}
