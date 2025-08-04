using SkillTrail.Biz.Abstractions;
using System.ComponentModel.DataAnnotations.Schema;

namespace SkillTrail.Biz.Entites
{
    public sealed class Evaluation : EntityBase
    {
        public string UserId { get; set; } = string.Empty;
        public string EvaluatorId { get; set; } = string.Empty;
        /// <summary>
        /// PGの評価
        /// </summary>
        public EvaluationStatus PGStatus { get; set; } = EvaluationStatus.None;
        /// <summary>
        /// 共有力の評価
        /// </summary>
        public EvaluationStatus ShareStateus { get; set; } = EvaluationStatus.None;
        /// <summary>
        /// コミュニケーションの評価(質問力等)
        /// </summary>
        public EvaluationStatus CommunicationStatus { get; set; } = EvaluationStatus.None;
        public string Comment { get; set; } = string.Empty;

        [ForeignKey(nameof(UserId))]
        public User User { get; set; } = null!;
        [ForeignKey(nameof(EvaluatorId))]
        public User Evaluator { get; set; } = null!;
    }

    public enum EvaluationStatus
    {
        None,
        /// <summary>
        /// 劣る
        /// </summary>
        Poor,
        /// <summary>
        /// やや劣る
        /// </summary>
        SlightlyPoor,
        /// <summary>
        /// 平均
        /// </summary>
        Average,
        /// <summary>
        /// 良い
        /// </summary>
        Good,
        /// <summary>
        /// とても良い
        /// </summary>
        Excellent,
    }
}
