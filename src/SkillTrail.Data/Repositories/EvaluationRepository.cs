using Microsoft.EntityFrameworkCore;
using SkillTrail.Biz.Entites;
using SkillTrail.Biz.Interfaces;
using SkillTrail.Data.DbContexts;

namespace SkillTrail.Data.Repositories
{
    public sealed class EvaluationRepository : IEvaluationRepository
    {
        private readonly SkillTrailDbContext _context;

        public EvaluationRepository(SkillTrailDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<IList<Evaluation>> GetByUserIdAsync(string userId)
        {
            return await _context.Evaluations
                .Include(e => e.User)
                .Include(e => e.Evaluator)
                .Where(e => e.UserId == userId)
                .OrderByDescending(e => e.UpdateDateTime)
                .ToListAsync();
        }

        public async Task<Evaluation?> GetAsync(string id)
        {
            return await _context.Evaluations
                .Include(e => e.User)
                .Include(e => e.Evaluator)
                .FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<bool> AddAsync(Evaluation evaluation)
        {
            try
            {
                _context.Evaluations.Add(evaluation);
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> UpdateAsync(Evaluation evaluation)
        {
            try
            {
                _context.Evaluations.Update(evaluation);
                await _context.SaveChangesAsync();
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
                var evaluation = await _context.Evaluations.FindAsync(id);
                if (evaluation == null) return false;

                _context.Evaluations.Remove(evaluation);
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}