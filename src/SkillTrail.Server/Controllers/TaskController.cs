using Microsoft.AspNetCore.Mvc;
using SkillTrail.Biz.ApplicationServices;
using Task = SkillTrail.Biz.Entites.Task;

namespace SkillTrail.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class TaskController(TaskApplicationService taskApplicationService) : ControllerBase
    {
        private readonly TaskApplicationService _taskApplicationService = taskApplicationService ?? throw new ArgumentNullException(nameof(taskApplicationService));

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var result = await _taskApplicationService.GetAsync();
            return new JsonResult(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            var result = await _taskApplicationService.GetAsync(id);
            return new JsonResult(result);
        }

        [HttpPost]
        public async Task<IActionResult> GetByCategory([FromBody] GetByCategoryRequest request)
        {
            var result = await _taskApplicationService.GetByCategoryIdAsync(request.CategoryId);
            return new JsonResult(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Task task)
        {
            var result = await _taskApplicationService.CreateAsync(task);
            return new JsonResult(result);
        }

        [HttpPost]
        public async Task<IActionResult> Update(Task task)
        {
            var result = await _taskApplicationService.UpdateAsync(task);
            return new JsonResult(result);
        }

        [HttpPost]
        public async Task<IActionResult> Delete([FromBody] DeleteTaskRequest request)
        {
            var result = await _taskApplicationService.DeleteAsync(request.Id);
            return new JsonResult(result);
        }

        [HttpPost]
        public async Task<IActionResult> Reorder([FromBody] ReorderTaskRequest request)
        {
            var result = await _taskApplicationService.ReorderAsync(request.CategoryId, request.TaskIds);
            return new JsonResult(result);
        }

        public sealed class DeleteTaskRequest
        {
            public string Id { get; set; } = string.Empty;
        }

        public sealed class ReorderTaskRequest
        {
            public string CategoryId { get; set; } = string.Empty;
            public IList<string> TaskIds { get; set; } = [];
        }

        public sealed class GetByCategoryRequest
        {
            public string CategoryId { get; set; } = string.Empty;
        }
    }
}
