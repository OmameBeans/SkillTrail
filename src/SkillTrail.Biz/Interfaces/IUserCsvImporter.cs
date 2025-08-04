using SkillTrail.Biz.Entites;

namespace SkillTrail.Biz.Interfaces
{
    public interface IUserCsvImporter
    {
        Task<IEnumerable<User>> ImportAsync(Stream stream, string fileName);
    }
}
