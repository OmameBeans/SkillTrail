using Microsoft.AspNetCore.Mvc;
using SkillTrail.Biz.ApplicationServices;

namespace SkillTrail.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class LevelController(LevelApplicationService levelApplicationService) : ControllerBase
    {
        private readonly LevelApplicationService _levelApplicationService = levelApplicationService ?? throw new ArgumentNullException(nameof(levelApplicationService));

        [HttpGet]
        public IActionResult Get()
        {
            var result = _levelApplicationService.GetLevels();
            return new JsonResult(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetCurrentUserLevel()
        {
            var result = await _levelApplicationService.GetCurrentUserLevelAsync();
            return new JsonResult(result);
        }
    }
}
