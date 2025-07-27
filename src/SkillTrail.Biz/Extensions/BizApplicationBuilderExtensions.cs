using Microsoft.Extensions.DependencyInjection;
using SkillTrail.Biz.ApplicationServices;

namespace SkillTrail.Biz.Extensions
{
    public static class BizApplicationBuilderExtensions
    {
        public static void AddBiz(this IServiceCollection services)
        {
            services.AddScoped<TaskApplicationService>();
            services.AddScoped<TaskCategoryApplicationService>();
            services.AddScoped<UserApplicationService>();
        }
    }
}
