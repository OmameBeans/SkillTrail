using SkillTrail.Biz.Entites;

namespace SkillTrail.Biz.Interfaces
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAsync();
        Task<User?> GetAsync(string id);
        Task<bool> AddAsync(User user);
        Task<bool> UpdateAsync(User user);
        Task<bool> DeleteAsync(string id);
    }
}