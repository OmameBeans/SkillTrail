import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Chip,
    Button,
    Box,
    Divider,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { type Evaluation, type EvaluationStatus, evaluationStatus } from '../../../entities/evaluation';

interface EvaluationCardProps {
    evaluation: Evaluation;
    isOwn: boolean;
    onEdit: (evaluation: Evaluation) => void;
    onDelete: (evaluationId: string) => void;
}

export const EvaluationCard = ({ evaluation, isOwn, onEdit, onDelete }: EvaluationCardProps) => {
    console.log(evaluation);
    const getStatusLabel = (status: EvaluationStatus) => {
        console.log(status);
        switch (status) {
            case evaluationStatus.None: return '未評価';
            case evaluationStatus.Poor: return '不良';
            case evaluationStatus.SlightlyPoor: return 'やや不良';
            case evaluationStatus.Average: return '普通';
            case evaluationStatus.Good: return '良好';
            case evaluationStatus.Excellent: return '優秀';
            default: return '未評価';
        }
    };

    const getStatusColor = (status: EvaluationStatus) => {
        switch (status) {
            case evaluationStatus.None: return 'default';
            case evaluationStatus.Poor: return 'error';
            case evaluationStatus.SlightlyPoor: return 'warning';
            case evaluationStatus.Average: return 'info';
            case evaluationStatus.Good: return 'success';
            case evaluationStatus.Excellent: return 'success';
            default: return 'default';
        }
    };

    return (
        <Card>
            <CardContent>
                {evaluation && (
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6" component="div">
                                {evaluation.evaluatorName}
                            </Typography>
                            {isOwn && (
                                <Chip label="自分の評価" size="small" color="primary" variant="outlined" />
                            )}
                        </Box>

                        <Divider sx={{ my: 1 }} />

                        <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" sx={{ minWidth: '80px' }}>PG:</Typography>
                                {evaluation.PGStatus != null && (
                                    <Chip
                                        label={getStatusLabel(evaluation.PGStatus)}
                                        color={getStatusColor(evaluation.PGStatus)}
                                        variant={evaluation.PGStatus === evaluationStatus.None ? 'outlined' : 'filled'}
                                        size="small"
                                    />
                                )}
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" sx={{ minWidth: '80px' }}>共有:</Typography>
                                {evaluation.ShareStatus != null && (
                                    <Chip
                                        label={getStatusLabel(evaluation.ShareStatus)}
                                        color={getStatusColor(evaluation.ShareStatus)}
                                        variant={evaluation.ShareStatus === evaluationStatus.None ? 'outlined' : 'filled'}
                                        size="small"
                                    />
                                )}
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" sx={{ minWidth: '80px' }}>コミュニケーション:</Typography>
                                {evaluation.CommunicationStatus != null && (
                                    <Chip
                                        label={getStatusLabel(evaluation.CommunicationStatus)}
                                        color={getStatusColor(evaluation.CommunicationStatus)}
                                        variant={evaluation.CommunicationStatus === evaluationStatus.None ? 'outlined' : 'filled'}
                                        size="small"
                                    />
                                )}
                            </Box>
                        </Box>
                    </>
                )}
                {evaluation.comment && (
                    <Typography variant="body2" color="text.secondary">
                        {evaluation.comment}
                    </Typography>
                )}
            </CardContent>

            {isOwn && (
                <CardActions>
                    <Button
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => onEdit(evaluation)}
                    >
                        編集
                    </Button>
                    <Button
                        size="small"
                        startIcon={<Delete />}
                        color="error"
                        onClick={() => onDelete(evaluation.id)}
                    >
                        削除
                    </Button>
                </CardActions>
            )}
        </Card>
    );
};
