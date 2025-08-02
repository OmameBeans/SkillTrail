using Microsoft.Extensions.DependencyInjection;
using SkillTrail.Biz.Interfaces;
using SkillTrail.IO.Importers;

namespace SkillTrail.IO.Extensions
{
    public static class IOApplicationBuilderExtensions
    {
        public static void AddIO(this IServiceCollection services)
        {
            services.AddScoped<IUserCsvImporter, UserCsvImporter>();
        }
    }
}
