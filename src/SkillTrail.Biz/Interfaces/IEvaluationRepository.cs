using SkillTrail.Biz.Entites;

namespace SkillTrail.Biz.Interfaces
{
    public interface IEvaluationRepository
    {
        Task<IList<Evaluation>> GetByUserIdAsync(string userId);
        Task<Evaluation?> GetAsync(string id);
        Task<bool> AddAsync(Evaluation evaluation);
        Task<bool> UpdateAsync(Evaluation evaluation);
        Task<bool> DeleteAsync(string id);
    }
}