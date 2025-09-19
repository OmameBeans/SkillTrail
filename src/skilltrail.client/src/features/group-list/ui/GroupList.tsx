import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardActions,
    Button,
    Stack,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useGroups } from '../../../entities/group';
import type { Group } from '../../../entities/group';

interface GroupListProps {
    onEdit: (group: Group) => void;
    onDelete: (group: Group) => void;
}

export const GroupList: React.FC<GroupListProps> = ({ onEdit, onDelete }) => {
    const { data: groups } = useGroups();

    if (!groups || groups.length === 0) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                py: 8
            }}>
                <Typography variant="body1" color="text.secondary">
                    グループが登録されていません
                </Typography>
            </Box>
        );
    }

    return (
        <Stack spacing={2}>
            {groups.map((group) => (
                <Card key={group.id} variant="outlined">
                    <CardContent>
                        <Typography variant="h6" component="h3" gutterBottom>
                            {group.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            id: {group.id}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            更新日時: {new Date(group.updateDateTime).toLocaleString('ja-JP')}
                        </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end', gap: 1 }}>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Edit />}
                            onClick={() => onEdit(group)}
                        >
                            編集
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            startIcon={<Delete />}
                            onClick={() => onDelete(group)}
                        >
                            削除
                        </Button>
                    </CardActions>
                </Card>
            ))}
        </Stack>
    );
};