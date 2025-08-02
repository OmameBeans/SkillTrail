using Microsoft.EntityFrameworkCore;
using SkillTrail.Biz.Entites;
using SkillTrail.Biz.Interfaces;
using SkillTrail.Data.DbContexts;

namespace SkillTrail.Data.Repositories
{
    public sealed class UserRepository(SkillTrailDbContext dbContext) : IUserRepository
    {
        private readonly SkillTrailDbContext _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));

        public async Task<bool> AddAsync(User user)
        {
            try
            {
                _dbContext.Add(user);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> DeleteAsync(string id)
        {
            try
            {
                var user = await _dbContext.Users.FindAsync(id);
                if (user != null)
                {
                    _dbContext.Users.Remove(user);
                    await _dbContext.SaveChangesAsync();
                    return true;
                }
            }
            catch
            {
                return false;
            }
            return false;
        }

        public async Task<IEnumerable<User>> GetAsync()
        {
            var users = await _dbContext.Users.ToListAsync();
            return users;
        }

        public async Task<User?> GetAsync(string id)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == id);
            return user;
        }

        public async Task<bool> UpdateAsync(User user)
        {
            try
            {
                var existingUser = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == user.Id);
                if (existingUser != null)
                {
                    existingUser.Name = user.Name;
                    existingUser.Role = user.Role;
                    existingUser.UpdateDateTime = user.UpdateDateTime;
                    existingUser.UpdateUserId = user.UpdateUserId;
                    await _dbContext.SaveChangesAsync();
                    return true;
                }
            }
            catch
            {
                return false;
            }
            return false;
        }
    }
}