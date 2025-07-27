namespace SkillTrail.Biz
{
    public class Result
    {
        public bool HasError => ErrorMessages.Count > 0;
        public List<string> ErrorMessages { get; set; } = [];
    }

    public class Result<T> : Result
    {
        public T? Data { get; set; }
        public Result() { }
        public Result(T data)
        {
            Data = data;
        }
    }
}
