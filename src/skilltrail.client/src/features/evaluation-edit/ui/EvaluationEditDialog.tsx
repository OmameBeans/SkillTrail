import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
} from '@mui/material';
import { evaluationStatus, type Evaluation, type EvaluationStatus } from '../../../entities/evaluation';

interface EvaluationEditDialogProps {
    open: boolean;
    evaluation?: Evaluation | null;
    userId: string;
    userName: string;
    onClose: () => void;
    onSubmit: (data: { 
        userId: string; 
        pgStatus: EvaluationStatus; 
        shareStatus: EvaluationStatus; 
        communicationStatus: EvaluationStatus; 
        comment: string; 
        evaluatorId: string 
    }) => void;
    isLoading: boolean;
}

export const EvaluationEditDialog = ({ 
    open, 
    evaluation, 
    userId, 
    userName, 
    onClose, 
    onSubmit, 
    isLoading 
}: EvaluationEditDialogProps) => {
    const [pgStatus, setPgStatus] = useState<EvaluationStatus>(evaluation?.PGStatus ?? evaluationStatus.None);
    const [shareStatus, setShareStatus] = useState<EvaluationStatus>(evaluation?.ShareStatus ?? evaluationStatus.None);
    const [communicationStatus, setCommunicationStatus] = useState<EvaluationStatus>(evaluation?.CommunicationStatus ?? evaluationStatus.None);
    const [comment, setComment] = useState(evaluation?.comment ?? '');

    const handleSubmit = () => {
        onSubmit({
            userId,
            pgStatus,
            shareStatus,
            communicationStatus,
            comment,
            evaluatorId: '', // ログインユーザーIDはAPIで設定される想定
        });
    };

    const handleClose = () => {
        setPgStatus(evaluation?.PGStatus ?? evaluationStatus.None);
        setShareStatus(evaluation?.ShareStatus ?? evaluationStatus.None);
        setCommunicationStatus(evaluation?.CommunicationStatus ?? evaluationStatus.None);
        setComment(evaluation?.comment ?? '');
        onClose();
    };

    const getStatusLabel = (statusValue: EvaluationStatus) => {
        switch (statusValue) {
            case evaluationStatus.None: return '未評価';
            case evaluationStatus.Poor: return '不良';
            case evaluationStatus.SlightlyPoor: return 'やや不良';
            case evaluationStatus.Average: return '普通';
            case evaluationStatus.Good: return '良好';
            case evaluationStatus.Excellent: return '優秀';
            default: return '未評価';
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {evaluation ? '評価を編集' : '評価を追加'} - {userName}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
                    <FormControl fullWidth>
                        <InputLabel>PG評価</InputLabel>
                        <Select
                            value={pgStatus}
                            label="PG評価"
                            onChange={(e) => setPgStatus(Number(e.target.value) as EvaluationStatus)}
                        >
                            {Object.entries(evaluationStatus).map(([key, value]) => (
                                <MenuItem key={key} value={value}>
                                    {getStatusLabel(value)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>共有評価</InputLabel>
                        <Select
                            value={shareStatus}
                            label="共有評価"
                            onChange={(e) => setShareStatus(Number(e.target.value) as EvaluationStatus)}
                        >
                            {Object.entries(evaluationStatus).map(([key, value]) => (
                                <MenuItem key={key} value={value}>
                                    {getStatusLabel(value)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>コミュニケーション評価</InputLabel>
                        <Select
                            value={communicationStatus}
                            label="コミュニケーション評価"
                            onChange={(e) => setCommunicationStatus(Number(e.target.value) as EvaluationStatus)}
                        >
                            {Object.entries(evaluationStatus).map(([key, value]) => (
                                <MenuItem key={key} value={value}>
                                    {getStatusLabel(value)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="コメント"
                        multiline
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        fullWidth
                        placeholder="評価に関するコメントを入力してください"
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={isLoading}>
                    キャンセル
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={isLoading}
                >
                    {evaluation ? '更新' : '追加'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
