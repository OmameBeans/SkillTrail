import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
} from '@mui/material';
import type { User } from '../../../entities/user/model/user';

interface UserDeleteDialogProps {
    open: boolean;
    user: User | null;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    isLoading: boolean;
}

export const UserDeleteDialog = ({ open, user, onClose, onConfirm, isLoading }: UserDeleteDialogProps) => {
    const handleConfirm = async () => {
        await onConfirm();
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>ユーザー削除の確認</DialogTitle>
            <DialogContent>
                <Typography>
                    ユーザー「{user?.name}」を削除しますか？
                    この操作は元に戻せません。
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>キャンセル</Button>
                <Button
                    onClick={handleConfirm}
                    color="error"
                    variant="contained"
                    disabled={isLoading}
                >
                    削除
                </Button>
            </DialogActions>
        </Dialog>
    );
};
