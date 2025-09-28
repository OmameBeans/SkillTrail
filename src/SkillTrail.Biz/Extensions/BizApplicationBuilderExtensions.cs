using Microsoft.Extensions.DependencyInjection;
using SkillTrail.Biz.ApplicationServices;
using SkillTrail.Biz.Interfaces;
using SkillTrail.Biz.Providers;
using SkillTrail.Biz.Services;
using Microsoft.Extensions.Configuration;

namespace SkillTrail.Biz.Extensions
{
    public static class BizApplicationBuilderExtensions
    {
        public static void AddBiz(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<GroupService>();

            services.AddScoped<TaskCategoryApplicationService>();
            services.AddScoped<TaskApplicationService>();
            services.AddScoped<UserApplicationService>();
            services.AddScoped<EvaluationApplicationService>();
            services.AddScoped<GroupApplicationService>();
            services.AddScoped<ProgressApplicationService>();

            if (!int.TryParse(configuration["Level:FirstItem"], out int firstItem))
            {
                firstItem = 10;
            }
            if (!double.TryParse(configuration["Level:CommonRatio"], out double commonRatio))
            {
                commonRatio = 1.2;
            }
            if (!int.TryParse(configuration["Level:MaxLevel"], out int maxLevel))
            {
                maxLevel = 50;
            }

            services.AddSingleton<IExperiencePointsProvider, ExperiencePointsProvider>(sp =>
            {
                return new ExperiencePointsProvider(firstItem, commonRatio, maxLevel);
            });

            services.AddScoped<LevelApplicationService>(sp =>
            {
                var experiencePointsProvider = sp.GetRequiredService<IExperiencePointsProvider>();
                return new LevelApplicationService(experiencePointsProvider, maxLevel);
            });
        }
    }
}
