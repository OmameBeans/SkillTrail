using Microsoft.AspNetCore.Mvc;
using SkillTrail.Biz;
using SkillTrail.Biz.ApplicationServices;
using SkillTrail.Biz.Entites;

namespace SkillTrail.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class UserController(UserApplicationService userApplicationService) : ControllerBase
    {
        private readonly UserApplicationService _userApplicationService = userApplicationService ?? throw new ArgumentNullException(nameof(userApplicationService));

        [HttpGet]
        public async Task<IActionResult> GetCurrentUser()
        {
            var result = await _userApplicationService.GetCurrentUserAsync();
            return new JsonResult(result);
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var result = await _userApplicationService.GetAsync();
            return new JsonResult(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create(User user)
        {
            var result = await _userApplicationService.CreateAsync(user);
            return new JsonResult(result);
        }

        [HttpPost]
        public async Task<IActionResult> Update(User user)
        {
            var result = await _userApplicationService.UpdateAsync(user);
            return new JsonResult(result);
        }

        [HttpPost]
        public async Task<IActionResult> Delete([FromBody] DeleteUserRequest request)
        {
            var result = await _userApplicationService.DeleteAsync(request.Id);
            return new JsonResult(result);
        }

        public sealed class DeleteUserRequest
        {
            public string Id { get; set; } = string.Empty;
        }

        [HttpPost]
        public async Task<IActionResult> Import(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("ファイルが選択されていません");
            }

            using var stream = file.OpenReadStream();
            var result = await _userApplicationService.ImportAsync(stream, file.FileName);

            return new JsonResult(result);
        }
    }
}
