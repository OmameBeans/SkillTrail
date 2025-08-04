using SkillTrail.Biz.Entites;
using SkillTrail.Biz.Interfaces;

namespace SkillTrail.Biz.ApplicationServices
{
    public sealed class EvaluationApplicationService
    {
        private readonly IEvaluationRepository _evaluationRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUserContext _userContext;

        public EvaluationApplicationService(
            IEvaluationRepository evaluationRepository,
            IUserRepository userRepository,
            IUserContext userContext)
        {
            _evaluationRepository = evaluationRepository ?? throw new ArgumentNullException(nameof(evaluationRepository));
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _userContext = userContext ?? throw new ArgumentNullException(nameof(userContext));
        }

        public async Task<Result<IList<EvaluationDTO>>> GetByUserIdAsync(string userId)
        {
            var evaluations = await _evaluationRepository.GetByUserIdAsync(userId);
            var dtos = evaluations.Select(e => new EvaluationDTO
            {
                Id = e.Id,
                UserId = e.UserId,
                UserName = e.User?.Name ?? string.Empty,
                EvaluatorId = e.EvaluatorId,
                EvaluatorName = e.Evaluator?.Name ?? string.Empty,
                PGStatus = e.PGStatus,
                ShareStatus = e.ShareStateus,
                CommunicationStatus = e.CommunicationStatus,
                Comment = e.Comment
            }).ToList();

            return new Result<IList<EvaluationDTO>>(dtos);
        }

        public async Task<Result<EvaluationDTO>> CreateAsync(EvaluationDTO dto)
        {
            if (dto == null)
            {
                var result = new Result<EvaluationDTO>();
                result.ErrorMessages.Add("評価データが設定されていません");
                return result;
            }

            var userInfo = await _userContext.GetCurrentUserInfoAsync();

            var evaluation = new Evaluation
            {
                Id = Guid.NewGuid().ToString(),
                UserId = dto.UserId,
                EvaluatorId = userInfo.Id,
                PGStatus = dto.PGStatus,
                ShareStateus = dto.ShareStatus,
                CommunicationStatus = dto.CommunicationStatus,
                Comment = dto.Comment,
                UpdateDateTime = DateTime.Now,
                UpdateUserId = userInfo.Id
            };

            if (await _evaluationRepository.AddAsync(evaluation))
            {
                // 作成した評価を取得してDTOに変換
                var createdEvaluation = await _evaluationRepository.GetAsync(evaluation.Id);
                if (createdEvaluation != null)
                {
                    var resultDto = new EvaluationDTO
                    {
                        Id = createdEvaluation.Id,
                        UserId = createdEvaluation.UserId,
                        UserName = createdEvaluation.User?.Name ?? string.Empty,
                        EvaluatorId = createdEvaluation.EvaluatorId,
                        EvaluatorName = createdEvaluation.Evaluator?.Name ?? string.Empty,
                        PGStatus = createdEvaluation.PGStatus,
                        ShareStatus = createdEvaluation.ShareStateus,
                        CommunicationStatus = createdEvaluation.CommunicationStatus,
                        Comment = createdEvaluation.Comment
                    };
                    return new Result<EvaluationDTO>(resultDto);
                }
            }

            var errorResult = new Result<EvaluationDTO>();
            errorResult.ErrorMessages.Add("評価の作成に失敗しました");
            return errorResult;
        }

        public async Task<Result<EvaluationDTO>> UpdateAsync(EvaluationDTO dto)
        {
            if (dto == null)
            {
                var result = new Result<EvaluationDTO>();
                result.ErrorMessages.Add("評価データが設定されていません");
                return result;
            }

            var evaluation = await _evaluationRepository.GetAsync(dto.Id);
            if (evaluation == null)
            {
                var result = new Result<EvaluationDTO>();
                result.ErrorMessages.Add("評価が見つかりません");
                return result;
            }

            var userInfo = await _userContext.GetCurrentUserInfoAsync();

            evaluation.PGStatus = dto.PGStatus;
            evaluation.ShareStateus = dto.ShareStatus;
            evaluation.CommunicationStatus = dto.CommunicationStatus;
            evaluation.Comment = dto.Comment;
            evaluation.UpdateDateTime = DateTime.Now;
            evaluation.UpdateUserId = userInfo.Id;

            if (await _evaluationRepository.UpdateAsync(evaluation))
            {
                var updatedEvaluation = await _evaluationRepository.GetAsync(evaluation.Id);
                if (updatedEvaluation != null)
                {
                    var resultDto = new EvaluationDTO
                    {
                        Id = updatedEvaluation.Id,
                        UserId = updatedEvaluation.UserId,
                        UserName = updatedEvaluation.User?.Name ?? string.Empty,
                        EvaluatorId = updatedEvaluation.EvaluatorId,
                        EvaluatorName = updatedEvaluation.Evaluator?.Name ?? string.Empty,
                        PGStatus = updatedEvaluation.PGStatus,
                        ShareStatus = updatedEvaluation.ShareStateus,
                        CommunicationStatus = updatedEvaluation.CommunicationStatus,
                        Comment = updatedEvaluation.Comment
                    };
                    return new Result<EvaluationDTO>(resultDto);
                }
            }

            var errorResult = new Result<EvaluationDTO>();
            errorResult.ErrorMessages.Add("評価の更新に失敗しました");
            return errorResult;
        }

        public async Task<Result> DeleteAsync(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                var result = new Result();
                result.ErrorMessages.Add("評価IDが設定されていません");
                return result;
            }

            if (await _evaluationRepository.DeleteAsync(id))
            {
                return new Result();
            }
            else
            {
                var result = new Result();
                result.ErrorMessages.Add("評価の削除に失敗しました");
                return result;
            }
        }
    }

    public sealed class EvaluationDTO
    {
        public string Id { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string EvaluatorId { get; set; } = string.Empty;
        public string EvaluatorName { get; set; } = string.Empty;
        /// <summary>
        /// PGの評価
        /// </summary>
        public EvaluationStatus PGStatus { get; set; } = EvaluationStatus.None;
        /// <summary>
        /// 共有力の評価
        /// </summary>
        public EvaluationStatus ShareStatus { get; set; } = EvaluationStatus.None;
        /// <summary>
        /// コミュニケーションの評価(質問力等)
        /// </summary>
        public EvaluationStatus CommunicationStatus { get; set; } = EvaluationStatus.None;
        public string Comment { get; set; } = string.Empty;
    }
}
