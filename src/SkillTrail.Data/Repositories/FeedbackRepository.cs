using Microsoft.EntityFrameworkCore;
using SkillTrail.Biz.Entites;
using SkillTrail.Biz.Interfaces;
using SkillTrail.Data.DbContexts;

namespace SkillTrail.Data.Repositories
{
    public class FeedbackRepository : IFeedbackRepository
    {
        private readonly SkillTrailDbContext _dbContext;

        public FeedbackRepository(SkillTrailDbContext dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        public async Task<bool> AddAsync(Feedback feedback)
        {
            try
            {
                _dbContext.Feedbacks.Add(feedback);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
