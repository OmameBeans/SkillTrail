using Microsoft.AspNetCore.Mvc;
using SkillTrail.Biz.ApplicationServices;

namespace SkillTrail.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class EvaluationController(EvaluationApplicationService evaluationApplicationService) : ControllerBase
    {
        private readonly EvaluationApplicationService _evaluationApplicationService = evaluationApplicationService ?? throw new ArgumentNullException(nameof(evaluationApplicationService));

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetByUserId(string userId)
        {
            var result = await _evaluationApplicationService.GetByUserIdAsync(userId);
            return new JsonResult(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] EvaluationDTO dto)
        {
            var result = await _evaluationApplicationService.CreateAsync(dto);
            return new JsonResult(result);
        }

        [HttpPost]
        public async Task<IActionResult> Update([FromBody] EvaluationDTO dto)
        {
            var result = await _evaluationApplicationService.UpdateAsync(dto);
            return new JsonResult(result);
        }

        [HttpPost]
        public async Task<IActionResult> Delete([FromBody] DeleteEvaluationRequest request)
        {
            var result = await _evaluationApplicationService.DeleteAsync(request.Id);
            return new JsonResult(result);
        }

        public sealed class DeleteEvaluationRequest
        {
            public string Id { get; set; } = string.Empty;
        }
    }
}
