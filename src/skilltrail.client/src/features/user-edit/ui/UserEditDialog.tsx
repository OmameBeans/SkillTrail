import React, { useState, useEffect, Suspense } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Box,
    CircularProgress,
} from '@mui/material';
import { role } from '../../../entities/user/model/user';
import { useGroups } from '../../../entities/group';
import type { User, Role } from '../../../entities/user/model/user';

type UserFormData = {
    id: string;
    name: string;
    role: Role;
    groupId?: string;
};

interface UserEditDialogProps {
    open: boolean;
    user?: User | null;
    onClose: () => void;
    onSubmit: (data: UserFormData) => Promise<void>;
    isLoading: boolean;
}

const GroupSelectField: React.FC<{
    value: string;
    onChange: (value: string) => void;
}> = ({ value, onChange }) => {
    const { data: groups } = useGroups();

    return (
        <FormControl fullWidth>
            <InputLabel>グループ</InputLabel>
            <Select
                value={value || ''}
                label="グループ"
                onChange={(e) => onChange(e.target.value || '')}
            >
                <MenuItem value="">
                    <em>グループを選択しない</em>
                </MenuItem>
                {groups?.map((group) => (
                    <MenuItem key={group.id} value={group.id}>
                        {group.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export const UserEditDialog = ({ open, user, onClose, onSubmit, isLoading }: UserEditDialogProps) => {
    const [formData, setFormData] = useState<UserFormData>({
        id: user?.id || '',
        name: user?.name || '',
        role: user?.role || role.TRAINEE,
        groupId: user?.groupId || '',
    });

    // ダイアログが開かれた時にフォームデータを更新
    useEffect(() => {
        if (open) {
            setFormData({
                id: user?.id || '',
                name: user?.name || '',
                role: user?.role || role.TRAINEE,
                groupId: user?.groupId || '',
            });
        }
    }, [open, user]);

    const handleSubmit = async () => {
        await onSubmit(formData);
        onClose();
    };

    const isEditing = !!user;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {isEditing ? 'ユーザー編集' : 'ユーザー作成'}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <TextField
                        label="ID"
                        value={formData.id}
                        onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                        fullWidth
                        required
                        disabled={isEditing} // 編集時はIDを変更不可
                        helperText={isEditing ? "IDは編集できません" : "ユーザーの一意なIDを入力してください"}
                    />
                    <TextField
                        label="名前"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        fullWidth
                        required
                    />
                    <Suspense fallback={
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                            <CircularProgress size={24} />
                        </Box>
                    }>
                        <GroupSelectField
                            value={formData.groupId || ''}
                            onChange={(value) => setFormData({ ...formData, groupId: value || undefined })}
                        />
                    </Suspense>
                    <FormControl fullWidth>
                        <InputLabel>役割</InputLabel>
                        <Select
                            value={formData.role}
                            label="役割"
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                        >
                            <MenuItem value={role.TRAINEE}>新人</MenuItem>
                            <MenuItem value={role.ADMIN}>管理者</MenuItem>
                            <MenuItem value={role.NONE}>未設定</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={
                        !formData.id.trim() ||
                        !formData.name.trim() ||
                        isLoading
                    }
                >
                    {isEditing ? '更新' : '作成'}
                </Button>
                <Button variant='outlined' onClick={onClose}>
                    キャンセル
                </Button>
            </DialogActions>
        </Dialog>
    );
};
