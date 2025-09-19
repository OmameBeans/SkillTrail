using SkillTrail.Biz.Entites;
using SkillTrail.Biz.Interfaces;

namespace SkillTrail.Biz.ApplicationServices
{
    public sealed class GroupApplicationService(IGroupRepository groupRepository, IUserContext userContext)
    {
        private readonly IGroupRepository _groupRepository = groupRepository ?? throw new ArgumentNullException(nameof(groupRepository));
        private readonly IUserContext _userContext = userContext ?? throw new ArgumentNullException(nameof(userContext));

        public async Task<Result<IList<Group>>> GetAsync()
        {
            var groups = await _groupRepository.GetAsync();
            return new Result<IList<Group>>(groups.ToArray());
        }

        public async Task<Result<Group>> GetAsync(string id)
        {
            var group = await _groupRepository.GetAsync(id);
            if (group == null)
            {
                var result = new Result<Group>();
                result.ErrorMessages.Add("グループが見つかりませんでした");
                return result;
            }
            return new Result<Group>(group);
        }

        public async Task<Result> CreateAsync(Group group)
        {
            if (group == null)
            {
                var result = new Result();
                result.ErrorMessages.Add("グループが設定されていません");
                return result;
            }

            if (string.IsNullOrWhiteSpace(group.Name))
            {
                var result = new Result();
                result.ErrorMessages.Add("グループ名が設定されていません");
                return result;
            }

            var userInfo = await _userContext.GetCurrentUserInfoAsync();

            var newGroup = new Group
            {
                Id = Guid.NewGuid().ToString(),
                Name = group.Name,
                UpdateDateTime = DateTime.Now,
                UpdateUserId = userInfo.Id,
            };

            if (await _groupRepository.AddAsync(newGroup))
            {
                return new Result();
            }
            else
            {
                var result = new Result();
                result.ErrorMessages.Add("グループの作成に失敗しました");
                return result;
            }
        }

        public async Task<Result> UpdateAsync(Group group)
        {
            if (group == null)
            {
                var result = new Result();
                result.ErrorMessages.Add("グループが設定されていません");
                return result;
            }

            if (string.IsNullOrWhiteSpace(group.Name))
            {
                var result = new Result();
                result.ErrorMessages.Add("グループ名が設定されていません");
                return result;
            }

            var userInfo = await _userContext.GetCurrentUserInfoAsync();
            group.UpdateDateTime = DateTime.Now;
            group.UpdateUserId = userInfo.Id;

            if (await _groupRepository.UpdateAsync(group))
            {
                return new Result();
            }
            else
            {
                var result = new Result();
                result.ErrorMessages.Add("グループの更新に失敗しました");
                return result;
            }
        }

        public async Task<Result> DeleteAsync(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                var result = new Result();
                result.ErrorMessages.Add("グループIDが設定されていません");
                return result;
            }

            if (await _groupRepository.DeleteAsync(id))
            {
                return new Result();
            }
            else
            {
                var result = new Result();
                result.ErrorMessages.Add("グループの削除に失敗しました");
                return result;
            }
        }
    }
}
