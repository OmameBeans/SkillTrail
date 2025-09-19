
using Microsoft.EntityFrameworkCore;
using SkillTrail.Biz.Extensions;
using SkillTrail.Biz.Interfaces;
using SkillTrail.Data.DbContexts;
using SkillTrail.Data.Extensions;
using SkillTrail.IO.Extensions;

namespace SkillTrail.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            var configuration = builder.Configuration;
            var provider = configuration.GetValue("Provider", "SQLite");

            builder.Services.AddDbContext<SkillTrailDbContext>(
                    options => _ = provider switch
                    {
                        "SQLite" => options.UseSqlite(
                            configuration.GetConnectionString("SQLite"),
                            x => x.MigrationsAssembly("SkillTrail.Migrations.SQLite")),

                        "SQLServer" => options.UseSqlServer(
                            configuration.GetConnectionString("SQLServer"),
                            x => x.MigrationsAssembly("SkillTrail.Migrations.SQLServer")),

                        _ => throw new Exception($"Unsupported provider: {provider}")
                    });

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddHttpContextAccessor();

            builder.Services.AddScoped<IUserContext, UserContextAdapter>();

            builder.Services.AddIO();
            builder.Services.AddData(builder.Configuration);
            builder.Services.AddBiz();

            var app = builder.Build();

            app.UseDefaultFiles();
            app.UseStaticFiles();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseAuthorization();


            app.MapControllers();

            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}
