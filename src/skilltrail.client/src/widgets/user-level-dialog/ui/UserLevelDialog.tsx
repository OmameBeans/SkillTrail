import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    CircularProgress,
    Alert,
    Typography,
    LinearProgress,
    Stack,
} from "@mui/material";
import { useCurrentUserLevel } from "../../../entities/level";

type Props = {
    isOpen: boolean;
    onClose: () => void;
}

export const UserLevelDialog = (props: Props) => {
    const { data: userLevel, isLoading, error } = useCurrentUserLevel();

    // 進捗率の計算
    const getProgressPercent = (current: number, next: number) => {
        if (current >= next) return 100;
        return (current / next) * 100;
    };

    // 次のレベルまでの必要経験値
    const getRemainingExp = (current: number, next: number) => {
        return Math.max(0, next - current);
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 200,
                    }}
                >
                    <CircularProgress />
                </Box>
            );
        }

        if (error) {
            return (
                <Alert severity="error" sx={{ m: 2 }}>
                    レベル情報の読み込みに失敗しました
                </Alert>
            );
        }

        if (!userLevel) {
            return (
                <Alert severity="info" sx={{ m: 2 }}>
                    レベル情報がありません
                </Alert>
            );
        }

        const progressPercent = getProgressPercent(
            userLevel.currentExperiencePoints,
            userLevel.nextLevelExperiencePoints
        );
        const remainingExp = getRemainingExp(
            userLevel.currentExperiencePoints,
            userLevel.nextLevelExperiencePoints
        );

        return (
            <Box sx={{ p: 2 }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: "center",
                    height: 100,
                    mb: 4,
                }}>
                    <Typography component={"div"} sx={{
                        fontSize: 48,
                    }}>
                        レベル {userLevel.level}
                    </Typography>
                </Box>

                {/* 経験値情報 */}
                <Stack spacing={2}>
                    <Box>
                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                gap: 1,
                            }}>
                                <Typography variant="body2" color="text.secondary">
                                    経験値
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {userLevel.currentExperiencePoints.toLocaleString()} XP
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{
                                flexGrow: 1,
                                display: 'flex',
                                justifyContent: 'end',
                            }}>
                                あと {remainingExp.toLocaleString()} XP でレベルアップ！
                            </Typography>
                        </Box>

                        <LinearProgress
                            variant="determinate"
                            value={progressPercent}
                            sx={{
                                height: 10,
                                mb: 1,
                                borderRadius: 5,
                                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                '& .MuiLinearProgress-bar': {
                                    borderRadius: 5,
                                }
                            }}
                        />
                    </Box>
                </Stack>
            </Box>
        );
    };

    return (
        <Dialog
            open={props.isOpen}
            onClose={props.onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                <Typography variant="h5" component="div">
                    現在のレベル
                </Typography>
            </DialogTitle>

            <DialogContent sx={{ p: 0 }}>
                {renderContent()}
            </DialogContent>

            <DialogActions sx={{ p: 1, justifyContent: 'end', borderTop: '1px solid #e0e0e0' }}>
                <Button
                    variant="outlined"
                    onClick={props.onClose}
                >
                    閉じる
                </Button>
            </DialogActions>
        </Dialog>
    );
};