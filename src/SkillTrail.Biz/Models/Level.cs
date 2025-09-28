namespace SkillTrail.Biz.Models
{
    public class LevelEntry
    {
        /// <summary>
        /// レベル値
        /// </summary>
        public int Level { get; set; }
        /// <summary>
        /// タスク完了時に得られる経験値
        /// </summary>
        public long ExperiencePoints { get; set; }
        /// <summary>
        /// レベル値に到達するまでに必要な累積経験値
        /// </summary>
        public long CumulativeExperiencePoints { get; set; }
    }
}
