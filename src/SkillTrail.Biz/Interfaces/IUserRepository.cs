using SkillTrail.Biz.Entites;

namespace SkillTrail.Biz.Interfaces
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAsync();
        Task<IEnumerable<User>> GetTraineesWithProgressesAsync(string groupId);
        Task<User?> GetAsync(string id);
        Task<bool> AddAsync(User user);
        Task<bool> AddRangeAsync(IList<User> users);
        Task<bool> UpdateAsync(User user);
        Task<bool> DeleteAsync(string id);
        Task<bool> UpdateExperiencePoints(string userId, long experiencePoints);
    }
}