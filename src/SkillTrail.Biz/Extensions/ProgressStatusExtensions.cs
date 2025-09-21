using SkillTrail.Biz.Entites;

namespace SkillTrail.Biz.Extensions
{
    public static class ProgressStatusExtensions
    {
        public static string ToDisplayString(this ProgressStatus status)
        {
            return status switch
            {
                ProgressStatus.None => "未設定",
                ProgressStatus.NotStarted => "未着手",
                ProgressStatus.InProgress => "進行中",
                ProgressStatus.Completed => "完了",
                _ => "不明",
            };
        }
    }
}
