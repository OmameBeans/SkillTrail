using Microsoft.Extensions.DependencyInjection;
using SkillTrail.Biz.ApplicationServices;
using SkillTrail.Biz.Services;

namespace SkillTrail.Biz.Extensions
{
    public static class BizApplicationBuilderExtensions
    {
        public static void AddBiz(this IServiceCollection services)
        {
            services.AddScoped<GroupService>();

            services.AddScoped<TaskCategoryApplicationService>();
            services.AddScoped<TaskApplicationService>();
            services.AddScoped<UserApplicationService>();
            services.AddScoped<EvaluationApplicationService>();
            services.AddScoped<GroupApplicationService>();
            services.AddScoped<ProgressApplicationService>();
        }
    }
}
