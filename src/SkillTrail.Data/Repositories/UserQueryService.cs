using Microsoft.EntityFrameworkCore;
using SkillTrail.Biz.Interfaces;
using SkillTrail.Data.DbContexts;

namespace SkillTrail.Data.Repositories
{
    public sealed class UserQueryService(SkillTrailDbContext dbContext) : IUserQueryService
    {
        private readonly SkillTrailDbContext _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));

        public async Task<IEnumerable<UserQueryServiceModel>> GetAsync()
        {
            var users = await _dbContext.Users
                .Include(u => u.Group)
                .Select(u => new UserQueryServiceModel
                {
                    Id = u.Id,
                    Name = u.Name,
                    Role = u.Role,
                    GroupId = u.GroupId,
                    GroupName = u.Group != null ? u.Group.Name : null
                })
                .ToListAsync();
            
            return users;
        }

        public async Task<UserQueryServiceModel?> GetAsync(string id)
        {
            var user = await _dbContext.Users
                .Include(u => u.Group)
                .Where(u => u.Id == id)
                .Select(u => new UserQueryServiceModel
                {
                    Id = u.Id,
                    Name = u.Name,
                    Role = u.Role,
                    GroupId = u.GroupId,
                    GroupName = u.Group != null ? u.Group.Name : null
                })
                .FirstOrDefaultAsync();
            
            return user;
        }

        public async Task<IEnumerable<UserQueryServiceModel>> GetByGroupIdAsync(string groupId)
        {
            var users = await _dbContext.Users
                .Include(u => u.Group)
                .Where(u => u.GroupId == groupId)
                .Select(u => new UserQueryServiceModel
                {
                    Id = u.Id,
                    Name = u.Name,
                    Role = u.Role,
                    GroupId = u.GroupId,
                    GroupName = u.Group != null ? u.Group.Name : null
                })
                .ToListAsync();
            
            return users;
        }
    }
}