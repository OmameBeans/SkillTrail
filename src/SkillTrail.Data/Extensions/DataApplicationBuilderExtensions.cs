using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SkillTrail.Biz.Interfaces;
using SkillTrail.Data.DbContexts;
using SkillTrail.Data.Repositories;

namespace SkillTrail.Data.Extensions
{
    public static class DataApplicationBuilderExtensions
    {
        public static void AddData(this IServiceCollection services, IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("SQLServer");

            if (string.IsNullOrEmpty(connectionString))
            {
                throw new Exception("接続文字列が設定されていません");
            }

            services.AddDbContext<SkillTrailDbContext>(options =>
            {
                options.UseSqlServer(connectionString);
            });

            services.AddScoped<ITaskCategoryRepository, TaskCategoryRepository>();
            services.AddScoped<ITaskRepository, TaskRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IEvaluationRepository, EvaluationRepository>();

            using (var scope = services.BuildServiceProvider().CreateScope())
            {
                try
                {
                    var dbContext = scope.ServiceProvider.GetRequiredService<SkillTrailDbContext>();
                    if (dbContext.Database.GetPendingMigrations().Any())
                        dbContext.Database.Migrate();
                }
                catch (Exception e)
                {
                    throw new Exception("データベースのマイグレーションに失敗しました", e);
                }
            }
        }
    }
}
