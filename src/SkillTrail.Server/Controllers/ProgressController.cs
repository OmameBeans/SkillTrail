using Microsoft.AspNetCore.Mvc;
using SkillTrail.Biz.ApplicationServices;
using SkillTrail.Biz.Entites;

namespace SkillTrail.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class ProgressController : ControllerBase
    {
        private readonly ProgressApplicationService _progressApplicationService;

        public ProgressController(ProgressApplicationService progressApplicationService)
        {
            _progressApplicationService = progressApplicationService ?? throw new ArgumentNullException(nameof(progressApplicationService));
        }

        /// <summary>
        /// 現在ログイン中のユーザーの進捗一覧を取得
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var result = await _progressApplicationService.GetCurrentUserProgressAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// 指定されたユーザーの進捗一覧を取得
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> GetByUserId([FromBody] GetByUserIdRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.UserId))
                {
                    return BadRequest(new { message = "ユーザーIDが必要です" });
                }

                var result = await _progressApplicationService.GetByUserIdAsync(request.UserId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// IDで進捗を取得
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> GetById([FromBody] GetByIdRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.Id))
                {
                    return BadRequest(new { message = "進捗IDが必要です" });
                }

                var result = await _progressApplicationService.GetByIdAsync(request.Id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// 進捗を更新
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Update([FromBody] UpdateProgressRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.TaskId))
                {
                    return BadRequest(new { message = "タスクIDが必要です" });
                }

                var result = await _progressApplicationService.UpdateProgressAsync(request.TaskId, request.Status, request.Note);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }

    public class GetByUserIdRequest
    {
        public string UserId { get; set; } = string.Empty;
    }

    public class GetByIdRequest
    {
        public string Id { get; set; } = string.Empty;
    }

    public class UpdateProgressRequest
    {
        public string TaskId { get; set; } = string.Empty;
        public ProgressStatus Status { get; set; }
        public string Note { get; set; } = string.Empty;
    }
}
