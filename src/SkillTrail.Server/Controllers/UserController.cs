using Microsoft.AspNetCore.Mvc;
using SkillTrail.Biz.ApplicationServices;

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
    }
}
