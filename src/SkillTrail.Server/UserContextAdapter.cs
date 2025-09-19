using SkillTrail.Biz.Interfaces;
using System.Diagnostics;

namespace SkillTrail.Server
{
    public sealed class UserContextAdapter(IHttpContextAccessor httpContextAccessor) : IUserContext
    {
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));

        public Task<UserInfo> GetCurrentUserInfoAsync()
        {
            var httpContext = _httpContextAccessor.HttpContext;

            // デバッグ時のモックユーザー
            if (Debugger.IsAttached)
            {
                return Task.FromResult(new UserInfo { Id = "manager" });
            }

            var rowUserId = _httpContextAccessor.HttpContext?.User?.Identity?.Name ?? string.Empty;
            var userId = rowUserId == string.Empty ? "test" : rowUserId.Substring(rowUserId.Length - 4, 4);
            return Task.FromResult(new UserInfo { Id = userId });
        }
    }
}
