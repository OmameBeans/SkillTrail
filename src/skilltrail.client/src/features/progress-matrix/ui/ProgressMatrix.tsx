import { useState, useMemo } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Typography, FormControl, InputLabel, Select, MenuItem, Stack } from '@mui/material';
import { useGetTraineesWithProgresses } from '../../../entities/user';
import { useTasks } from '../../../entities/task';
import { useGroups } from '../../../entities/group';
import { progressStatus, type ProgressStatus } from '../../../entities/progress/model/progress';

export const ProgressMatrix = () => {
    const [groupId, setGroupId] = useState<string>(''); // 空文字列: 全新人
    const { data: trainees } = useGetTraineesWithProgresses(groupId);
    const { data: tasks } = useTasks();
    const { data: groups } = useGroups();

    const taskIds = useMemo(() => (tasks ?? []).map(t => t.id), [tasks]);

    const statusLabel = (status: ProgressStatus) => {
        switch (status) {
            case progressStatus.NOT_STARTED: return '未着手';
            case progressStatus.IN_PROGRESS: return '進行中';
            case progressStatus.COMPLETED: return '完了';
            default: return '';
        }
    };

    const statusColor = (status: ProgressStatus) => {
        switch (status) {
            case progressStatus.NOT_STARTED: return 'default';
            case progressStatus.IN_PROGRESS: return 'warning';
            case progressStatus.COMPLETED: return 'success';
            default: return 'default';
        }
    };

    const findStatus = (user: any, taskId: string): ProgressStatus | undefined => {
        return user?.progresses?.find((p: any) => p.taskId === taskId)?.status;
    };

    return (
        <Box>
            <FormControl size='small' sx={{ minWidth: 240, mb: 2 }}>
                <InputLabel id='group-select-label'>グループ</InputLabel>
                <Select
                    labelId='group-select-label'
                    value={groupId}
                    label='グループ'
                    onChange={(e) => setGroupId(e.target.value)}
                >
                    <MenuItem value=''><em>全ての新人</em></MenuItem>
                    {groups?.map(g => (
                        <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <TableContainer component={Paper} variant='outlined' sx={{ maxHeight: 600, overflowX: 'auto' }}>
                <Table size='small' stickyHeader sx={{ minWidth: 800 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600, minWidth: 160, position: 'sticky', left: 0, zIndex: 3, backgroundColor: (theme) => theme.palette.background.paper, boxShadow: (theme) => `2px 0 0 ${theme.palette.divider}` }}>ユーザー</TableCell>
                            {(tasks ?? []).map(task => (
                                <TableCell key={task.id} align='center' sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                                    {task.title}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(trainees ?? []).map(user => (
                            <TableRow key={user.id} hover>
                                <TableCell sx={{ fontWeight: 500, position: 'sticky', left: 0, zIndex: 2, backgroundColor: (theme) => theme.palette.background.paper, boxShadow: (theme) => `2px 0 0 ${theme.palette.divider}` }}>
                                    <Stack spacing={0.3}>
                                        <span>{user.name}</span>
                                        <Typography variant='caption' color='text.secondary'>{user.id}</Typography>
                                    </Stack>
                                </TableCell>
                                {taskIds.map(taskId => {
                                    const st = findStatus(user, taskId);
                                    return (
                                        <TableCell key={taskId} align='center' sx={{ p: 0.5 }}>
                                            {st !== undefined ? (
                                                <Chip size='small' label={statusLabel(st)} color={statusColor(st) as any} variant='outlined' sx={{ fontSize: 11 }} />
                                            ) : (
                                                <Typography variant='caption' color='text.disabled'>-</Typography>
                                            )}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};
