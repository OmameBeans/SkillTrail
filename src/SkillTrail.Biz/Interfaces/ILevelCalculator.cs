namespace SkillTrail.Biz.Interfaces
{
    /// <summary>
    /// レベル計算を担当するサービスのインターフェース
    /// </summary>
    public interface ILevelCalculator
    {
        /// <summary>
        /// 完了したタスクのレベルリストに基づいて、現在のレベルを計算します
        /// </summary>
        /// <param name="completedLevels">完了したタスクのレベルリスト</param>
        /// <returns>計算された現在のレベル</returns>
        int CalculateLevel(IEnumerable<int> completedLevels);

        /// <summary>
        /// 前回のレベルと新しいレベルのリストを比較して、レベルの差分を計算します
        /// </summary>
        /// <param name="previousLevels">前回のレベルリスト</param>
        /// <param name="newLevels">新しいレベルリスト</param>
        /// <returns>レベルの差分（新しいレベル - 前回のレベル）</returns>
        int CalculateLevelDifference(IEnumerable<int> previousLevels, IEnumerable<int> newLevels);
    }
}