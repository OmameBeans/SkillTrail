using SkillTrail.Biz.Entites;
using SkillTrail.Biz.Interfaces;
using SkillTrail.Data.DbContexts;

namespace SkillTrail.Data.Repositories
{
    public sealed class UserRepository(SkillTrailDbContext dbContext) : IUserRepository
    {
        private readonly SkillTrailDbContext _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));

        public bool Add(User user)
        {
            try
            {
                _dbContext.Add(user);
                _dbContext.SaveChanges();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool Delete(string id)
        {
            try
            {
                var user = _dbContext.Users.Find(id);
                if (user != null)
                {
                    _dbContext.Users.Remove(user);
                    _dbContext.SaveChanges();
                    return true;
                }
            }
            catch
            {
                return false;
            }
            return false;
        }

        public IList<User> Get()
        {
            var users = _dbContext.Users.ToList();
            return users;
        }

        public User? Get(string id)
        {
            var user = _dbContext.Users.FirstOrDefault(u => u.Id == id);
            return user;
        }

        public bool Update(User user)
        {
            try
            {
                var existingUser = _dbContext.Users.FirstOrDefault(u => u.Id == user.Id);
                if (existingUser != null)
                {
                    existingUser.Name = user.Name;
                    existingUser.Role = user.Role;
                    existingUser.UpdateDateTime = user.UpdateDateTime;
                    existingUser.UpdateUserId = user.UpdateUserId;
                    _dbContext.SaveChanges();
                    return true;
                }
            }
            catch
            {
                return false;
            }
            return false;
        }
    }
}