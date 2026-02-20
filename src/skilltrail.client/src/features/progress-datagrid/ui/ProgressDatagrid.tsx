import { useState, useCallback, useEffect, useMemo } from 'react';
import { DataGrid, type GridColDef, type GridRenderEditCellParams, type GridCellParams } from '@mui/x-data-grid';
import { Select, MenuItem, FormControl, Box, Chip, InputBase, Paper, Popper } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import {
    RadioButtonUnchecked,
    PlayArrow,
    CheckCircle,
    HelpOutline
} from '@mui/icons-material';
import { useCurrentUserProgress, useUpdateProgress } from '../../../entities/progress/api/queries';
import { progressStatus, type ProgressStatus } from '../../../entities/progress/model/progress';
import { useTaskCategories } from '../../../entities/task-category/api/queries';
import { useSnackbar } from 'notistack';
import { useLocalStorage } from '../../../shared/hooks';

// 進捗ステータスの設定（ラベル、アイコン、色）
const progressStatusConfig = {
    [progressStatus.NONE]: {
        label: '未設定',
        icon: HelpOutline,
        color: '#9e9e9e',
        backgroundColor: '#f5f5f5',
    },
    [progressStatus.NOT_STARTED]: {
        label: '未着手',
        icon: RadioButtonUnchecked,
        color: '#ff9800',
        backgroundColor: '#fff3e0',
    },
    [progressStatus.IN_PROGRESS]: {
        label: '進行中',
        icon: PlayArrow,
        color: '#2196f3',
        backgroundColor: '#e3f2fd',
    },
    [progressStatus.COMPLETED]: {
        label: '完了',
        icon: CheckCircle,
        color: '#4caf50',
        backgroundColor: '#e8f5e8',
    },
};

const SELECTED_CATEGORY_STORAGE_KEY = 'progress.selectedCategoryId';

const ProgressSelectEditor = (props: GridRenderEditCellParams) => {
    const { id, value, api, field } = props;

    const handleChange = (newValue: ProgressStatus) => {
        api.setEditCellValue({ id, field, value: newValue });
        api.stopCellEditMode({ id, field });
    };

    return (
        <FormControl
            fullWidth
            size="small"
            sx={{
                height: '100%',
                '& .MuiInputBase-root': {
                    height: '100%',
                    border: 'none',
                    '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                    },
                },
                '& .MuiSelect-select': {
                    height: '100%',
                    padding: '0 14px',
                    display: 'flex',
                    alignItems: 'center',
                },
            }}
        >
            <Select
                value={value}
                onChange={(e) => handleChange(e.target.value as ProgressStatus)}
                autoFocus
                fullWidth
                sx={{
                    height: '100%',
                    '& .MuiSelect-select': {
                        padding: '0 14px',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                    },
                }}
            >
                {[progressStatus.NOT_STARTED, progressStatus.IN_PROGRESS, progressStatus.COMPLETED].map((status) => {
                    const StatusIcon = progressStatusConfig[status].icon;
                    return (
                        <MenuItem value={status} key={status}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <StatusIcon sx={{ color: progressStatusConfig[status].color }} />
                                {progressStatusConfig[status].label}
                            </Box>
                        </MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    );
};

const CommentTextarea = (props: GridRenderEditCellParams) => {
    const { id, field, value, colDef, hasFocus, api } = props;
    const [valueState, setValueState] = useState(value);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>();
    const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);

    useEffect(() => {
        if (hasFocus && inputRef) {
            // 少し遅延させてフォーカスを設定してEnterキーの影響を避ける
            const timer = setTimeout(() => {
                inputRef.focus();
                const length = inputRef.value.length;
                inputRef.setSelectionRange(length, length);
            }, 10);

            return () => clearTimeout(timer);
        }
        return undefined;
    }, [hasFocus, inputRef]);

    const handleRef = (el: HTMLElement | null) => {
        setAnchorEl(el);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && !event.ctrlKey && !event.shiftKey) {
            event.stopPropagation();
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newValue = event.target.value;
        setValueState(newValue);
        api.setEditCellValue(
            { id, field, value: newValue, debounceMs: 200 },
            event,
        );
    };

    return (
        <div style={{ position: 'relative', alignSelf: 'flex-start' }}>
            <div
                ref={handleRef}
                style={{
                    height: 1,
                    width: colDef.computedWidth,
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                }}
            />
            {anchorEl && (
                <Popper open anchorEl={anchorEl} placement="bottom-start">
                    <Paper elevation={1} sx={{ p: 1, minWidth: colDef.computedWidth }}>
                        <InputBase
                            multiline
                            rows={10}
                            value={valueState}
                            sx={{ textarea: { resize: 'both' }, width: '100%' }}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            inputRef={(ref) => setInputRef(ref)}
                        />
                    </Paper>
                </Popper>
            )}
        </div>
    );
};

export const ProgressDatagrid = () => {
    const { data: categories } = useTaskCategories();
    const [storedCategoryId, setStoredCategoryId] = useLocalStorage<string>(SELECTED_CATEGORY_STORAGE_KEY, '');
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>(storedCategoryId ?? '');
    const normalizedCategoryId = selectedCategoryId.trim() ? selectedCategoryId : undefined;
    const { data: progressData } = useCurrentUserProgress(normalizedCategoryId);
    const updateProgressMutation = useUpdateProgress();
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const normalizedStored = storedCategoryId ?? '';
        setSelectedCategoryId(prev => (prev === normalizedStored ? prev : normalizedStored));
    }, [storedCategoryId]);

    useEffect(() => {
        if (!categories) {
            return;
        }

        if (!selectedCategoryId) {
            return;
        }

        const exists = categories.some(category => category.id === selectedCategoryId);
        if (!exists) {
            setSelectedCategoryId('');
            setStoredCategoryId('');
        }
    }, [categories, selectedCategoryId, setStoredCategoryId]);

    const categoryOptions = useMemo(() => {
        if (!categories) {
            return [];
        }

        return [...categories].sort((a, b) => a.order - b.order);
    }, [categories]);

    const handleCategoryChange = useCallback((event: SelectChangeEvent<string>) => {
        const value = event.target.value as string;
        setSelectedCategoryId(value);
        setStoredCategoryId(value ? value : '');
    }, [setStoredCategoryId]);

    // 進捗更新処理
    const handleProgressUpdate = useCallback(
        async (taskId: string, newStatus: ProgressStatus, note: string) => {
            setLoading(true);
            try {
                const result = await updateProgressMutation.mutateAsync({
                    taskId,
                    status: newStatus,
                    note,
                });

                if (result.hasError) {
                    enqueueSnackbar('進捗の更新に失敗しました', { variant: 'error' });
                    console.log(result.errorMessages);
                    return;
                }

                enqueueSnackbar('進捗を更新しました', { variant: 'success' });

                if (result.data) {
                    const { prevLevel, newLevel } = result.data;
                    if (newLevel > prevLevel) {
                        enqueueSnackbar(`レベルが${prevLevel}から${newLevel}に上がりました！`, { variant: 'success' });
                    }
                    if (newLevel < prevLevel) {
                        enqueueSnackbar(`レベルが${prevLevel}から${newLevel}に下がりました😢`, { variant: 'warning' });
                    }
                }
            } catch (error) {
                enqueueSnackbar('進捗の更新に失敗しました', { variant: 'error' });
                console.error('Progress update error:', error);
            } finally {
                setLoading(false);
            }
        },
        [updateProgressMutation, enqueueSnackbar]
    );

    // DataGridの列定義
    const columns: GridColDef[] = [
        {
            field: 'taskName',
            headerName: 'タスク名',
            width: 400,
            editable: false,
        },
        {
            field: 'taskDescription',
            headerName: 'タスク説明',
            width: 400,
            editable: false,
        },
        {
            field: 'level',
            headerName: 'レベル',
            width: 100,
            type: 'number',
            headerAlign: "left",
            align: "center",
            editable: false,
        },
        {
            field: 'status',
            headerName: '進捗',
            width: 150,
            editable: true,
            renderCell: (params: GridCellParams) => {
                const status = params.value as ProgressStatus;
                const config = progressStatusConfig[status];
                const StatusIcon = config.icon;

                return (
                    <Box sx={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                    }}>
                        <Chip
                            icon={<StatusIcon />}
                            label={config.label}
                            size="small"
                            sx={{
                                backgroundColor: config.backgroundColor,
                                color: config.color,
                                '& .MuiChip-icon': {
                                    color: config.color,
                                },
                            }}
                        />
                    </Box>
                );
            },
            renderEditCell: ProgressSelectEditor,
        },
        {
            field: 'note',
            headerName: 'メモ',
            minWidth: 200,
            editable: true,
            flex: 1,
            renderEditCell: (params) => <CommentTextarea {...params} />,
        }
    ];

    // データグリッド用のデータ変換
    const rows = progressData?.map((progress) => ({
        id: progress.taskId,
        taskId: progress.taskId,
        level: progress.level,
        taskName: progress.taskName,
        taskDescription: progress.taskDescription,
        status: progress.status,
        note: progress.note || '',
    })) || [];

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
            gap: 2,
        }}>
            <Box sx={{
                display: 'flex',
                pl: 2,
            }}>
                <FormControl size="small" sx={{ minWidth: 220 }}>
                    <Select
                        value={selectedCategoryId}
                        onChange={handleCategoryChange}
                        displayEmpty
                        renderValue={(value) => {
                            if (!value) {
                                return 'すべてのカテゴリ';
                            }

                            const match = categoryOptions.find(option => option.id === value);
                            return match?.title ?? 'すべてのカテゴリ';
                        }}
                        inputProps={{ 'aria-label': 'タスクカテゴリの選択' }}
                    >
                        <MenuItem value="">
                            <em>すべてのカテゴリ</em>
                        </MenuItem>
                        {categoryOptions.map((category) => (
                            <MenuItem key={category.id} value={category.id}>
                                {category.title}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Box sx={{
                flex: 1,
                display: 'flex',
                minHeight: 0,
            }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    loading={loading}
                    disableRowSelectionOnClick
                    processRowUpdate={async (newRow) => {
                        const oldRow = rows.find(row => row.id === newRow.id);
                        if (oldRow && (oldRow.status !== newRow.status || oldRow.note !== newRow.note)) {
                            await handleProgressUpdate(newRow.taskId, newRow.status, newRow.note);
                        }
                        return newRow;
                    }}
                    onProcessRowUpdateError={(error) => {
                        console.error('Row update error:', error);
                        enqueueSnackbar('進捗の更新に失敗しました', { variant: 'error' });
                    }}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 100 },
                        },
                    }}
                    pageSizeOptions={[25, 50, 100]}
                    sx={{ border: 0 }}
                    rowHeight={36}
                    showToolbar
                />
            </Box>
        </Box>
    );
};