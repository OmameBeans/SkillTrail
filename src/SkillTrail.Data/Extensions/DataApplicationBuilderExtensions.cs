using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SkillTrail.Biz.Interfaces;
using SkillTrail.Data.DbContexts;
using SkillTrail.Data.Repositories;
using SkillTrail.Data.QueryServices;

namespace SkillTrail.Data.Extensions
{
    public static class DataApplicationBuilderExtensions
    {
        public static void AddData(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<ITaskCategoryRepository, TaskCategoryRepository>();
            services.AddScoped<ITaskRepository, TaskRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IEvaluationRepository, EvaluationRepository>();
            services.AddScoped<IGroupRepository, GroupRepository>();
            services.AddScoped<IProgressRepository, ProgressRepository>();
            services.AddScoped<IUserQueryService, UserQueryService>();
            services.AddScoped<IProgressQueryService, ProgressQueryService>();

            //using (var scope = services.BuildServiceProvider().CreateScope())
            //{
            //    try
            //    {
            //        var dbContext = scope.ServiceProvider.GetRequiredService<SkillTrailDbContext>();
            //        if (dbContext.Database.GetPendingMigrations().Any())
            //            dbContext.Database.Migrate();
            //    }
            //    catch (Exception e)
            //    {
            //        throw new Exception("データベースのマイグレーションに失敗しました", e);
            //    }
            //}
        }
    }
}
