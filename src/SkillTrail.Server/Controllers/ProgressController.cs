using Microsoft.AspNetCore.Mvc;
using SkillTrail.Biz.ApplicationServices;
using SkillTrail.Biz.Entites;
using System.Net;
using static SkillTrail.Server.Controllers.GroupController;
using System.IO;
using System.Linq;

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
        public async Task<IActionResult> Get([FromQuery(Name = "cid")] string? categoryId = null)
        {
            try
            {
                var normalizedCategoryId = string.IsNullOrWhiteSpace(categoryId) ? null : categoryId;
                var result = await _progressApplicationService.GetCurrentUserProgressAsync(normalizedCategoryId);
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

                var categoryId = string.IsNullOrWhiteSpace(request.CategoryId) ? null : request.CategoryId;
                var result = await _progressApplicationService.GetByUserIdAsync(request.UserId, categoryId);
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

        [HttpPost]
        public async Task<IActionResult> ExportTraineeProgress([FromBody] ExportTraineeProgressRequest request)
        {
            try
            {
                var result = await _progressApplicationService.ExportProgressesToExcelAsync(request.GroupId, request.CategoryId);

                if (result.HasError)
                {
                    return BadRequest(new { message = string.Join(", ", result.ErrorMessages) });
                }

                var stream = result.Data?.Stream;
                if (stream == null)
                {
                    return BadRequest(new { message = "ファイルの生成に失敗しました" });
                }

                var groupName = result.Data?.GroupName ?? string.Empty;
                var categoryName = result.Data?.CategoryName ?? "すべてのカテゴリ";
                var safeGroupName = SanitizeFileNameSegment(groupName);
                var safeCategoryName = SanitizeFileNameSegment(categoryName);
                var fileName = $"進捗一覧_{safeGroupName}_{safeCategoryName}_{DateTime.Now:yyyyMMddHHmmss}.xlsx";

                // Excelファイルとしてダウンロード
                return File(
                    fileStream: stream,
                    contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    fileDownloadName: fileName
                );
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"エクスポート中にエラーが発生しました: {ex.Message}" });
            }
        }

        private static string SanitizeFileNameSegment(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return "未設定";
            }

            var invalidChars = Path.GetInvalidFileNameChars();
            return new string(value.Select(ch => invalidChars.Contains(ch) ? '_' : ch).ToArray());
        }
    }

    public class GetByUserIdRequest
    {
        public string UserId { get; set; } = string.Empty;
        public string? CategoryId { get; set; }
    }

    public class GetByIdRequest
    {
        public string Id { get; set; } = string.Empty;
    }

    public sealed class ExportTraineeProgressRequest
    {
        public string GroupId { get; set; } = string.Empty;
        public string? CategoryId { get; set; }
    }

    public class UpdateProgressRequest
    {
        public string TaskId { get; set; } = string.Empty;
        public ProgressStatus Status { get; set; }
        public string Note { get; set; } = string.Empty;
    }
}
