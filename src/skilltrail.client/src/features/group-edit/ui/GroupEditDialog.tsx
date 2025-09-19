import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Alert,
} from '@mui/material';
import { useCreateGroup, useUpdateGroup } from '../../../entities/group';
import type { Group } from '../../../entities/group';

interface GroupEditDialogProps {
    isOpen: boolean;
    group?: Group | null;
    onClose: () => void;
    onSuccess: () => void;
}

export const GroupEditDialog: React.FC<GroupEditDialogProps> = ({
    isOpen,
    group,
    onClose,
    onSuccess,
}) => {
    const [name, setName] = useState('');
    const [errors, setErrors] = useState<string[]>([]);

    const createGroupMutation = useCreateGroup();
    const updateGroupMutation = useUpdateGroup();

    const isEditMode = !!group;
    const isLoading = createGroupMutation.isPending || updateGroupMutation.isPending;

    useEffect(() => {
        if (group) {
            setName(group.name);
        } else {
            setName('');
        }
        setErrors([]);
    }, [group, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);

        if (!name.trim()) {
            setErrors(['グループ名を入力してください']);
            return;
        }

        try {
            if (isEditMode && group) {
                await updateGroupMutation.mutateAsync({
                    ...group,
                    name: name.trim(),
                });
            } else {
                await createGroupMutation.mutateAsync({
                    name: name.trim(),
                });
            }
            onSuccess();
            onClose();
        } catch (error) {
            if (error instanceof Error) {
                setErrors([error.message]);
            } else {
                setErrors(['予期しないエラーが発生しました']);
            }
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {isEditMode ? 'グループ編集' : 'グループ作成'}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    {errors.length > 0 && (
                        <Alert severity="error">
                            <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                                {errors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </Alert>
                    )}
                    <TextField
                        label="グループ名"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        required
                        placeholder="グループ名を入力してください"
                        inputProps={{ maxLength: 100 }}
                        helperText="必須項目です"
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={isLoading || !name.trim()}
                >
                    {isLoading
                        ? '処理中...'
                        : isEditMode
                        ? '更新'
                        : '作成'}
                </Button>
                <Button 
                    variant="outlined" 
                    onClick={onClose}
                    disabled={isLoading}
                >
                    キャンセル
                </Button>
            </DialogActions>
        </Dialog>
    );
};