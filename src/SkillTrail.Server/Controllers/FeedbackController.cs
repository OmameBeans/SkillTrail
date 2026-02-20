using Microsoft.AspNetCore.Mvc;
using SkillTrail.Biz.ApplicationServices;

namespace SkillTrail.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class FeedbackController : ControllerBase
    {
        private readonly FeedbackApplicationService _feedbackApplicationService;

        public FeedbackController(FeedbackApplicationService feedbackApplicationService)
        {
            _feedbackApplicationService = feedbackApplicationService ?? throw new ArgumentNullException(nameof(feedbackApplicationService));
        }

        [HttpPost]
        public async Task<IActionResult> SubmitFeedback(FeedbackRequest request)
        {
            var result = await _feedbackApplicationService.SubmitFeedbackAsync(request.Comment);

            return new JsonResult(result);
        }

        public class FeedbackRequest
        {
            public string Comment { get; set; } = string.Empty;
        }
    }
}
