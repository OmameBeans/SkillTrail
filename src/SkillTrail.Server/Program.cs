using Microsoft.EntityFrameworkCore;
using Serilog;
using Serilog.Sinks.MSSqlServer;
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

            // SerilogÇÃäÓñ{ê›íË
            var loggerConfiguration = new LoggerConfiguration()
                .MinimumLevel.Information()
                .WriteTo.Console()
                .WriteTo.File("logs/skilltrail-.txt",
                rollingInterval: RollingInterval.Day,
                fileSizeLimitBytes: 10_000_000,
                rollOnFileSizeLimit: true);

            if (provider == "SQLite")
            {
                var connectionString = configuration.GetConnectionString("SQLite");

                builder.Services.AddDbContext<SkillTrailDbContext>(
                    options => options.UseSqlite(
                        connectionString,
                        x => x.MigrationsAssembly("SkillTrail.Migrations.SQLite")));
            }
            else if (provider == "SQLServer")
            {
                var connectionString = configuration.GetConnectionString("SQLServer");

                //var sinkOpts = new MSSqlServerSinkOptions
                //{
                //    TableName = "Logs",
                //    AutoCreateSqlTable = true,
                //};

                //loggerConfiguration.WriteTo.MSSqlServer(
                //    connectionString: connectionString,
                //    sinkOptions: sinkOpts);

                builder.Services.AddDbContext<SkillTrailDbContext>(
                    options => options.UseSqlServer(
                        connectionString,
                        x => x.MigrationsAssembly("SkillTrail.Migrations.SQLServer")));
            }

            Log.Logger = loggerConfiguration.CreateLogger();
            builder.Host.UseSerilog();

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddHttpContextAccessor();

            builder.Services.AddScoped<IUserContext, MockUserContextAdapter>();

            builder.Services.AddIO();
            builder.Services.AddData(builder.Configuration);
            builder.Services.AddBiz(builder.Configuration);

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
