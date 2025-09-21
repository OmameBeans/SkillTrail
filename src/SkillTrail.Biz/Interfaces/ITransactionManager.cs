namespace SkillTrail.Biz.Interfaces
{
    public interface ITransactionManager : IDisposable
    {
        Task BeginAsync();
        Task CommitAsync();
        Task RollbackAsync();
    }
}
