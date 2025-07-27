using Microsoft.AspNetCore.Mvc;
using SkillTrail.Biz.ApplicationServices;
using SkillTrail.Biz.Entites;

namespace SkillTrail.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class TaskCategoryController(TaskCategoryApplicationService taskCategoryApplicationService) : ControllerBase
    {
        private readonly TaskCategoryApplicationService _taskCategoryApplicationService = taskCategoryApplicationService ?? throw new ArgumentNullException(nameof(taskCategoryApplicationService));

        [HttpGet]
        public IActionResult Get()
        {
            var result = _taskCategoryApplicationService.Get();
            return new JsonResult(result);
        }

        [HttpGet("{id}")]
        public IActionResult Get(string id)
        {
            var result = _taskCategoryApplicationService.Get(id);
            return new JsonResult(result);
        }

        [HttpPost]
        public IActionResult Create(TaskCategory taskCategory)
        {
            var result = _taskCategoryApplicationService.Create(taskCategory);
            return new JsonResult(result);
        }

        [HttpPost]
        public IActionResult Update(TaskCategory taskCategory)
        {
            var result = _taskCategoryApplicationService.Update(taskCategory);
            return new JsonResult(result);
        }

        [HttpPost]
        public IActionResult Delete([FromBody] DeleteRequest request)
        {
            var id = request.Id;

            var result = _taskCategoryApplicationService.Delete(id);
            return new JsonResult(result);
        }

        public sealed class DeleteRequest
        {
            public string Id { get; set; } = string.Empty;
        }

        [HttpPost]
        public IActionResult Reorder([FromBody] ReorderRequest request)
        {
            var result = _taskCategoryApplicationService.Reorder(request.CategoryIds);
            return new JsonResult(result);
        }

        public sealed class ReorderRequest
        {
            public IList<string> CategoryIds { get; set; } = [];
        }
    }
}
