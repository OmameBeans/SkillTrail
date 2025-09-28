using Microsoft.EntityFrameworkCore;
using SkillTrail.Biz.Entites;
using SkillTrail.Biz.Interfaces;
using SkillTrail.Data.DbContexts;

namespace SkillTrail.Data.Repositories
{
    public class ProgressRepository : IProgressRepository
    {
        private readonly SkillTrailDbContext _dbContext;

        public ProgressRepository(SkillTrailDbContext dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        public async Task<bool> AddOrUpdateAsync(Progress progress)
        {
            try
            {
                // 既存の進捗を検索（TaskId + UserId の組み合わせで）
                var existingProgress = await _dbContext.Progresses
                    .FirstOrDefaultAsync(p => p.TaskId == progress.TaskId && p.UserId == progress.UserId);

                if (existingProgress != null)
                {
                    // 更新
                    existingProgress.Status = progress.Status;
                    existingProgress.UpdateDateTime = progress.UpdateDateTime;
                    existingProgress.UpdateUserId = progress.UpdateUserId;
                }
                else
                {
                    // 新規追加
                    _dbContext.Progresses.Add(progress);
                }

                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public Task<Progress?> GetByIdAsync(string id)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Progress>> GetByTaskIdAsync(string taskId)
        {
            return await _dbContext.Progresses
                .Where(p => p.TaskId == taskId)
                .ToListAsync();
        }

        public async Task<Progress?> GetByTaskIdAndUserIdAsync(string taskId, string userId)
        {
            return await _dbContext.Progresses
                .FirstOrDefaultAsync(p => p.TaskId == taskId && p.UserId == userId);
        }

        public async Task<IEnumerable<Progress>> GetByUserIdAsync(string userId)
        {
            return await _dbContext.Progresses
                .Where(p => p.UserId == userId)
                .ToListAsync();
        }
    }
}
