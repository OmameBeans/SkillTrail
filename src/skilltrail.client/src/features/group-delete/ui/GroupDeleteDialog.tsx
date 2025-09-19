import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Alert,
    Paper,
} from '@mui/material';
import { Warning } from '@mui/icons-material';
import { useDeleteGroup } from '../../../entities/group';
import type { Group } from '../../../entities/group';

interface GroupDeleteDialogProps {
    isOpen: boolean;
    group: Group | null;
    onClose: () => void;
    onSuccess: () => void;
}

export const GroupDeleteDialog: React.FC<GroupDeleteDialogProps> = ({
    isOpen,
    group,
    onClose,
    onSuccess,
}) => {
    const [errors, setErrors] = useState<string[]>([]);
    const deleteGroupMutation = useDeleteGroup();

    const handleDelete = async () => {
        if (!group) return;

        setErrors([]);

        try {
            await deleteGroupMutation.mutateAsync(group.id);
            onSuccess();
            onClose();
        } catch (error) {
            if (error instanceof Error) {
                setErrors([error.message]);
            } else {
                setErrors(['グループの削除に失敗しました']);
            }
        }
    };

    if (!group) return null;

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
                <Warning />
                グループ削除
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {errors.length > 0 && (
                        <Alert severity="error">
                            <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                                {errors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </Alert>
                    )}
                    <Typography variant="body1" gutterBottom>
                        以下のグループを削除してもよろしいですか？
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                        <Typography variant="h6" component="div">
                            {group.name}
                        </Typography>
                    </Paper>
                    <Alert severity="warning">
                        この操作は元に戻すことができません。
                    </Alert>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleDelete}
                    disabled={deleteGroupMutation.isPending}
                >
                    {deleteGroupMutation.isPending ? '削除中...' : '削除'}
                </Button>
                <Button 
                    variant="outlined" 
                    onClick={onClose}
                    disabled={deleteGroupMutation.isPending}
                >
                    キャンセル
                </Button>
            </DialogActions>
        </Dialog>
    );
};