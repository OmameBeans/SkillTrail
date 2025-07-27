using SkillTrail.Biz.Entites;

namespace SkillTrail.Biz.Interfaces
{
    public interface IUserRepository
    {
        IList<User> Get();
        User? Get(string id);
        bool Add(User user);
        bool Update(User user);
        bool Delete(string id);
    }
}