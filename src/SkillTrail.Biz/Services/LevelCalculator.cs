using SkillTrail.Biz.Interfaces;

namespace SkillTrail.Biz.Services
{
    /// <summary>
    /// レベル計算を担当するサービス
    /// </summary>
    public class LevelCalculator : ILevelCalculator
    {
        private readonly IExperiencePointsProvider _experiencePointsProvider;

        public LevelCalculator(IExperiencePointsProvider experiencePointsProvider)
        {
            _experiencePointsProvider = experiencePointsProvider ?? throw new ArgumentNullException(nameof(experiencePointsProvider));
        }

        /// <summary>
        /// 完了したタスクのレベルリストに基づいて、現在のレベルを計算します
        /// </summary>
        /// <param name="completedLevels">完了したタスクのレベルリスト</param>
        /// <returns>計算された現在のレベル</returns>
        public int CalculateLevel(IEnumerable<int> completedLevels)
        {
            if (completedLevels == null)
            {
                throw new ArgumentNullException(nameof(completedLevels));
            }

            return _experiencePointsProvider.GetLevelFromLevels(completedLevels.ToArray());
        }

        /// <summary>
        /// 前回のレベルと新しいレベルのリストを比較して、レベルの差分を計算します
        /// </summary>
        /// <param name="previousLevels">前回のレベルリスト</param>
        /// <param name="newLevels">新しいレベルリスト</param>
        /// <returns>レベルの差分（新しいレベル - 前回のレベル）</returns>
        public int CalculateLevelDifference(IEnumerable<int> previousLevels, IEnumerable<int> newLevels)
        {
            if (previousLevels == null)
            {
                throw new ArgumentNullException(nameof(previousLevels));
            }

            if (newLevels == null)
            {
                throw new ArgumentNullException(nameof(newLevels));
            }

            var previousLevel = CalculateLevel(previousLevels);
            var newLevel = CalculateLevel(newLevels);

            return newLevel - previousLevel;
        }
    }
}