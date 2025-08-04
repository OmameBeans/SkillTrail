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
        public async Task<IActionResult> Get()
        {
            var result = await _taskCategoryApplicationService.GetAsync();
            return new JsonResult(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            var result = await _taskCategoryApplicationService.GetAsync(id);
            return new JsonResult(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create(TaskCategory taskCategory)
        {
            var result = await _taskCategoryApplicationService.CreateAsync(taskCategory);
            return new JsonResult(result);
        }

        [HttpPost]
        public async Task<IActionResult> Update(TaskCategory taskCategory)
        {
            var result = await _taskCategoryApplicationService.UpdateAsync(taskCategory);
            return new JsonResult(result);
        }

        [HttpPost]
        public async Task<IActionResult> Delete([FromBody] DeleteRequest request)
        {
            var id = request.Id;

            var result = await _taskCategoryApplicationService.DeleteAsync(id);
            return new JsonResult(result);
        }

        public sealed class DeleteRequest
        {
            public string Id { get; set; } = string.Empty;
        }

        [HttpPost]
        public async Task<IActionResult> Reorder([FromBody] ReorderRequest request)
        {
            var result = await _taskCategoryApplicationService.ReorderAsync(request.CategoryIds);
            return new JsonResult(result);
        }

        public sealed class ReorderRequest
        {
            public IList<string> CategoryIds { get; set; } = [];
        }
    }
}
