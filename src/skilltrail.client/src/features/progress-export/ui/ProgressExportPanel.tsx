import { Box, Button, MenuItem, Select } from "@mui/material";
import { useGroups } from "../../../entities/group"
import { useExportTraineeProgress } from "../../../entities/progress";
import { useState } from "react";

export const ProgressExportPanel = () => {
    const { data: groups } = useGroups();
    const exportTraineeProgress = useExportTraineeProgress();
    const [groupId, setGroupId] = useState<string>('');
    const groupName = groups?.find(g => g.id === groupId)?.name || '全ての新人';

    return (
        <Box sx={{
            p: 2,
            display: 'flex',
            gap: 2,
        }}>
            <Select value={groupId} onChange={(e) => setGroupId(e.target.value)} displayEmpty size="small" sx={{ minWidth: 240 }} >
                <MenuItem value=''><em>全ての新人</em></MenuItem>
                {groups?.map(g => (
                    <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
                ))}
            </Select>
            <Button variant="outlined" onClick={() => exportTraineeProgress.mutate({
                groupId,
                groupName,
            })}
                loading={exportTraineeProgress.isPending}
            >
                進捗をエクスポート
            </Button>
        </Box>
    );
}