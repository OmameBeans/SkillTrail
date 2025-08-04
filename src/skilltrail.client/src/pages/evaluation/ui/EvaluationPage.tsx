import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Grid,
    Alert,
    Paper,
    Divider,
} from '@mui/material';
import { ArrowBack, Add } from '@mui/icons-material';
import {
    useEvaluationsByUserId,
    useCreateEvaluation,
    useUpdateEvaluation,
    useDeleteEvaluation,
    type Evaluation,
    type EvaluationStatus
} from '../../../entities/evaluation';
import { useCurrentUser } from '../../../entities/user/api/queries';
import { EvaluationEditDialog } from '../../../features/evaluation-edit';
import { EvaluationCard } from '../../../features/evaluation-list';

export const EvaluationPage = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();

    if (!userId) {
        navigate('/admin/users');
        return null;
    }

    const { data: evaluations } = useEvaluationsByUserId(userId);
    const { data: currentUser } = useCurrentUser();
    const createEvaluationMutation = useCreateEvaluation();
    const updateEvaluationMutation = useUpdateEvaluation();
    const deleteEvaluationMutation = useDeleteEvaluation();

    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editingEvaluation, setEditingEvaluation] = useState<Evaluation | null>(null);

    // 現在のユーザーの評価と他の管理者の評価を分ける
    const currentUserEvaluation = evaluations.find(e => e.evaluatorId === currentUser?.id);
    const otherEvaluations = evaluations.filter(e => e.evaluatorId !== currentUser?.id);

    // 評価対象のユーザー名を取得（最初の評価から取得）
    const targetUserName = evaluations.length > 0 ? evaluations[0].userName : 'ユーザー';

    const handleOpenCreateDialog = () => {
        setEditingEvaluation(null);
        setOpenEditDialog(true);
    };

    const handleOpenEditDialog = (evaluation: Evaluation) => {
        setEditingEvaluation(evaluation);
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setEditingEvaluation(null);
    };

    const handleSubmitEvaluation = async (data: {
        userId: string;
        pgStatus: EvaluationStatus;
        shareStatus: EvaluationStatus;
        communicationStatus: EvaluationStatus;
        comment: string;
        evaluatorId: string
    }) => {
        try {
            if (editingEvaluation) {
                await updateEvaluationMutation.mutateAsync({
                    ...editingEvaluation,
                    PGStatus: data.pgStatus,
                    ShareStatus: data.shareStatus,
                    CommunicationStatus: data.communicationStatus,
                    comment: data.comment,
                });
            } else {
                await createEvaluationMutation.mutateAsync({
                    userId: data.userId,
                    userName: targetUserName,
                    evaluatorId: currentUser?.id || '',
                    evaluatorName: currentUser?.name || '',
                    PGStatus: data.pgStatus,
                    ShareStatus: data.shareStatus,
                    CommunicationStatus: data.communicationStatus,
                    comment: data.comment,
                });
            }
            handleCloseEditDialog();
        } catch (error) {
            console.error('Evaluation operation failed:', error);
        }
    };

    const handleDeleteEvaluation = async (evaluationId: string) => {
        if (window.confirm('この評価を削除しますか？')) {
            try {
                await deleteEvaluationMutation.mutateAsync(evaluationId);
            } catch (error) {
                console.error('Delete failed:', error);
            }
        }
    };

    return (
        <Box sx={{
            flexGrow: 1,
            p: 3,
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* ヘッダー */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/admin/user')}
                    sx={{ mr: 2 }}
                >
                    ユーザー一覧に戻る
                </Button>
                <Typography variant="h4" component="h1">
                    {targetUserName}の評価
                </Typography>
            </Box>

            {/* エラー表示 */}
            {(createEvaluationMutation.error || updateEvaluationMutation.error || deleteEvaluationMutation.error) && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {createEvaluationMutation.error?.message ||
                        updateEvaluationMutation.error?.message ||
                        deleteEvaluationMutation.error?.message}
                </Alert>
            )}

            <Grid
                sx={{
                    flex: 1,
                    display: 'flex',
                }}
                container spacing={3}>
                {/* 左側: 自分の評価 */}
                <Grid size={{
                    xs: 12,
                    md: 6,
                }}
                    sx={{
                        display: "flex",
                    }}>
                    <Paper sx={{
                        p: 2,
                        minHeight: 0,
                        flex: 1,
                        overflow: 'auto',
                    }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">
                                自分の評価
                            </Typography>
                            {!currentUserEvaluation && (
                                <Button
                                    variant="outlined"
                                    startIcon={<Add />}
                                    onClick={handleOpenCreateDialog}
                                    disabled={createEvaluationMutation.isPending}
                                >
                                    評価を追加
                                </Button>
                            )}
                        </Box>
                        <Divider sx={{ mb: 2 }} />

                        {currentUserEvaluation ? (
                            <EvaluationCard
                                evaluation={currentUserEvaluation}
                                isOwn={true}
                                onEdit={handleOpenEditDialog}
                                onDelete={handleDeleteEvaluation}
                            />
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <Typography variant="body2" color="text.secondary">
                                    まだ評価が登録されていません
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* 右側: 他の管理者の評価 */}
                <Grid size={{
                    xs: 12,
                    md: 6,
                }}
                    sx={{
                        display: "flex",
                    }}>
                    <Paper sx={{
                        p: 2,
                        minHeight: 0,
                        flex: 1,
                        overflow: 'auto',
                    }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            他の管理者の評価
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        {otherEvaluations.length > 0 ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {otherEvaluations.map((evaluation) => (
                                    <EvaluationCard
                                        key={evaluation.id}
                                        evaluation={evaluation}
                                        isOwn={false}
                                        onEdit={() => { }} // 他の管理者の評価は編集不可
                                        onDelete={() => { }} // 他の管理者の評価は削除不可
                                    />
                                ))}
                            </Box>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <Typography variant="body2" color="text.secondary">
                                    他の管理者からの評価はありません
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {/* 評価編集ダイアログ */}
            <EvaluationEditDialog
                open={openEditDialog}
                evaluation={editingEvaluation}
                userId={userId}
                userName={targetUserName}
                onClose={handleCloseEditDialog}
                onSubmit={handleSubmitEvaluation}
                isLoading={createEvaluationMutation.isPending || updateEvaluationMutation.isPending}
            />
        </Box>
    );
};
