using Microsoft.EntityFrameworkCore;
using SkillTrail.Biz.Entites;
using SkillTrail.Biz.Interfaces;
using SkillTrail.Data.DbContexts;

namespace SkillTrail.Data.Repositories
{
    public sealed class GroupRepository(SkillTrailDbContext dbContext) : IGroupRepository
    {
        private readonly SkillTrailDbContext _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));

        public async Task<bool> AddAsync(Group group)
        {
            try
            {
                _dbContext.Add(group);
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
                var group = await _dbContext.Groups.FindAsync(id);
                if (group != null)
                {
                    _dbContext.Groups.Remove(group);
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

        public async Task<IEnumerable<Group>> GetAsync()
        {
            var groups = await _dbContext.Groups.ToListAsync();
            return groups;
        }

        public async Task<Group?> GetAsync(string id)
        {
            var group = await _dbContext.Groups.FirstOrDefaultAsync(g => g.Id == id);
            return group;
        }

        public async Task<bool> UpdateAsync(Group group)
        {
            try
            {
                var existingGroup = await _dbContext.Groups.FirstOrDefaultAsync(g => g.Id == group.Id);
                if (existingGroup != null)
                {
                    existingGroup.Name = group.Name;
                    existingGroup.UpdateDateTime = group.UpdateDateTime;
                    existingGroup.UpdateUserId = group.UpdateUserId;
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