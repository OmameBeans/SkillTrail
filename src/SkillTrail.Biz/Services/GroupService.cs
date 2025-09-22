using SkillTrail.Biz.Interfaces;

namespace SkillTrail.Biz.Services
{
    public class GroupService(IGroupRepository groupRepository)
    {
        private readonly IGroupRepository _groupRepository = groupRepository ?? throw new ArgumentNullException(nameof(groupRepository));

        public async Task<bool> ExistsGroup(string groupId)
        {
            var group = await _groupRepository.GetAsync(groupId);
            return group != null;
        }
    }
}
