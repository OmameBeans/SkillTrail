import { useState, useEffect } from 'react';
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
} from '@mui/material';
import { role } from '../../../entities/user/model/user';
import type { User, Role } from '../../../entities/user/model/user';

type UserFormData = {
    id: string;
    name: string;
    role: Role;
};

interface UserEditDialogProps {
    open: boolean;
    user?: User | null;
    onClose: () => void;
    onSubmit: (data: UserFormData) => Promise<void>;
    isLoading: boolean;
}

export const UserEditDialog = ({ open, user, onClose, onSubmit, isLoading }: UserEditDialogProps) => {
    const [formData, setFormData] = useState<UserFormData>({
        id: user?.id || '',
        name: user?.name || '',
        role: user?.role || role.TRAINEE,
    });

    // ダイアログが開かれた時にフォームデータを更新
    useEffect(() => {
        if (open) {
            setFormData({
                id: user?.id || '',
                name: user?.name || '',
                role: user?.role || role.TRAINEE,
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
                    <FormControl fullWidth>
                        <InputLabel>役割</InputLabel>
                        <Select
                            value={formData.role}
                            label="役割"
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                        >
                            <MenuItem value={role.TRAINEE}>受講者</MenuItem>
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
