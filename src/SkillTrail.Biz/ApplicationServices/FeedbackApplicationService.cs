using SkillTrail.Biz.Entites;
using SkillTrail.Biz.Interfaces;

namespace SkillTrail.Biz.ApplicationServices
{
    public class FeedbackApplicationService
    {
        private readonly IFeedbackRepository _feedbackRepository;
        private readonly IUserContext _userContext;

        public FeedbackApplicationService(
            IFeedbackRepository feedbackRepository,
            IUserContext userContext)
        {
            _feedbackRepository = feedbackRepository ?? throw new ArgumentNullException(nameof(feedbackRepository));
            _userContext = userContext ?? throw new ArgumentNullException(nameof(userContext));
        }

        public async Task<Result> SubmitFeedbackAsync(string comment)
        {
            var userInfo = await _userContext.GetCurrentUserInfoAsync();

            var feedback = new Feedback
            {
                Id = Guid.NewGuid().ToString(),
                UserId = userInfo.Id,
                Comment = comment,
                UpdateDateTime = DateTime.Now,
                UpdateUserId = userInfo.Id
            };

            if (await _feedbackRepository.AddAsync(feedback))
            {
                return new Result();
            }
            else
            {
                var result = new Result();
                result.ErrorMessages.Add("フィードバックの保存に失敗しました");
                return result;
            }
        }
    }
}
