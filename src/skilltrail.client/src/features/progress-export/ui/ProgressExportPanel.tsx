import { Box, Button, FormControl, MenuItem, Select } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import { useGroups } from "../../../entities/group";
import { useExportTraineeProgress } from "../../../entities/progress";
import { useTaskCategories } from "../../../entities/task-category";
import { useMemo } from "react";
import { useLocalStorage } from "../../../shared/hooks";

export const ProgressExportPanel = () => {
    const { data: groups } = useGroups();
    const { data: categories } = useTaskCategories();
    const exportTraineeProgress = useExportTraineeProgress();
    // Persist selections so the export panel remembers the last choice
    const [storedGroupId, setStoredGroupId] = useLocalStorage<string>('progressExport.groupId', '');
    const [storedCategoryId, setStoredCategoryId] = useLocalStorage<string>('progressExport.categoryId', '');
    const groupId = storedGroupId ?? '';
    const categoryId = storedCategoryId ?? '';

    const sortedCategories = useMemo(() => {
        if (!categories) {
            return [];
        }

        return [...categories].sort((a, b) => a.order - b.order);
    }, [categories]);

    const groupName = groups?.find(g => g.id === groupId)?.name || '全ての新人';
    const categoryName = categoryId
        ? (sortedCategories.find(category => category.id === categoryId)?.title ?? 'すべてのカテゴリ')
        : 'すべてのカテゴリ';

    const normalizedGroupId = groupId.trim();
    const normalizedCategoryId = categoryId.trim();

    const handleGroupChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value as string;
        setStoredGroupId(value ? value : '');
    };

    const handleCategoryChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value as string;
        setStoredCategoryId(value ? value : '');
    };

    return (
        <Box sx={{
            p: 2,
            display: 'flex',
            gap: 2,
        }}>
            <FormControl size="small" sx={{ minWidth: 240 }}>
                <Select
                    value={groupId}
                    onChange={handleGroupChange}
                    displayEmpty
                    renderValue={(value) => {
                        if (!value) {
                            return '全ての新人';
                        }

                        const match = groups?.find(group => group.id === value);
                        return match?.name ?? '全ての新人';
                    }}
                >
                    <MenuItem value=''><em>全ての新人</em></MenuItem>
                    {groups?.map(g => (
                        <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 240 }}>
                <Select
                    value={categoryId}
                    onChange={handleCategoryChange}
                    displayEmpty
                    renderValue={(value) => {
                        if (!value) {
                            return 'すべてのカテゴリ';
                        }

                        const match = sortedCategories.find(category => category.id === value);
                        return match?.title ?? 'すべてのカテゴリ';
                    }}
                >
                    <MenuItem value=""><em>すべてのカテゴリ</em></MenuItem>
                    {sortedCategories.map(category => (
                        <MenuItem key={category.id} value={category.id}>{category.title}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button variant="outlined" onClick={() => exportTraineeProgress.mutate({
                groupId: normalizedGroupId,
                groupName,
                categoryId: normalizedCategoryId || undefined,
                categoryName,
            })}
                loading={exportTraineeProgress.isPending}
            >
                進捗をエクスポート
            </Button>
        </Box>
    );
}