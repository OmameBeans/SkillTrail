using Microsoft.Extensions.Logging;
using SkillTrail.Biz.Interfaces;
using SkillTrail.Data.DbContexts;

namespace SkillTrail.Data.Managers
{
    public class TransactionManager(SkillTrailDbContext dbContext, ILogger<TransactionManager> logger) : ITransactionManager
    {
        private readonly SkillTrailDbContext _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        private readonly ILogger<TransactionManager> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

        public async Task BeginAsync()
        {
            _logger.LogInformation("トランザクションを開始");
            await _dbContext.Database.BeginTransactionAsync();
        }

        public void Dispose()
        {
            _dbContext.Dispose();
        }

        public async Task RollbackAsync()
        {
            _logger.LogWarning("トランザクションをロールバック");
            await _dbContext.Database.RollbackTransactionAsync();
        }

        public async Task CommitAsync()
        {
            _logger.LogInformation("トランザクションをコミット");
            await _dbContext.Database.CommitTransactionAsync();
        }
    }
}
