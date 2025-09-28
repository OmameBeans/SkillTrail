namespace SkillTrail.Biz.Interfaces
{
    public interface IExperiencePointsProvider
    {
        long GetExperiencePoints(int level);
        long GetCumulativeExperiencePoints(int level);
        long GetLevelFromExperiencePoints(long experiencePoints);
        int GetLevelFromLevels(IReadOnlyCollection<int> levels);
    }
}
