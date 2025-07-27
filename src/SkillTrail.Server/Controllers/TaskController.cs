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
        public IActionResult Get()
        {
            var result = _taskApplicationService.Get();
            return new JsonResult(result);
        }

        [HttpGet("{id}")]
        public IActionResult Get(string id)
        {
            var result = _taskApplicationService.Get(id);
            return new JsonResult(result);
        }

        [HttpPost]
        public IActionResult GetByCategory([FromBody] GetByCategoryRequest request)
        {
            var result = _taskApplicationService.GetByCategoryId(request.CategoryId);
            return new JsonResult(result);
        }

        [HttpPost]
        public IActionResult Create(Task task)
        {
            var result = _taskApplicationService.Create(task);
            return new JsonResult(result);
        }

        [HttpPost]
        public IActionResult Update(Task task)
        {
            var result = _taskApplicationService.Update(task);
            return new JsonResult(result);
        }

        [HttpPost]
        public IActionResult Delete([FromBody] DeleteTaskRequest request)
        {
            var result = _taskApplicationService.Delete(request.Id);
            return new JsonResult(result);
        }

        [HttpPost]
        public IActionResult Reorder([FromBody] ReorderTaskRequest request)
        {
            var result = _taskApplicationService.Reorder(request.CategoryId, request.TaskIds);
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
