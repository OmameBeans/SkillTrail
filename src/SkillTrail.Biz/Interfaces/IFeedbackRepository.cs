using SkillTrail.Biz.Entites;

namespace SkillTrail.Biz.Interfaces
{
    public interface IFeedbackRepository
    {
        Task<bool> AddAsync(Feedback feedback);
    }
}
