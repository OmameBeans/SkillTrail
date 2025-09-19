using Microsoft.AspNetCore.Mvc;
using SkillTrail.Biz.ApplicationServices;
using SkillTrail.Biz.Entites;

namespace SkillTrail.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class GroupController(GroupApplicationService groupApplicationService) : ControllerBase
    {
        private readonly GroupApplicationService _groupApplicationService = groupApplicationService ?? throw new ArgumentNullException(nameof(groupApplicationService));

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var result = await _groupApplicationService.GetAsync();
            return new JsonResult(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            var result = await _groupApplicationService.GetAsync(id);
            return new JsonResult(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Group group)
        {
            var result = await _groupApplicationService.CreateAsync(group);
            return new JsonResult(result);
        }

        [HttpPost]
        public async Task<IActionResult> Update(Group group)
        {
            var result = await _groupApplicationService.UpdateAsync(group);
            return new JsonResult(result);
        }

        [HttpPost]
        public async Task<IActionResult> Delete([FromBody] DeleteGroupRequest request)
        {
            var result = await _groupApplicationService.DeleteAsync(request.Id);
            return new JsonResult(result);
        }

        public sealed class DeleteGroupRequest
        {
            public string Id { get; set; } = string.Empty;
        }
    }
}
