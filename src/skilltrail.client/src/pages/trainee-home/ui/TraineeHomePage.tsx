import { Box, Typography, Card, CardContent, List, ListItem, ListItemIcon, ListItemText, LinearProgress } from "@mui/material";
import { TrendingUp, CheckCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useCurrentUserProgress } from "../../../entities/progress/api/queries";
import { progressStatus } from "../../../entities/progress/model/progress";

export const TraineeHomePage = () => {
    const navigate = useNavigate();
    const { data: progressData } = useCurrentUserProgress();

    // 進捗統計の計算
    const progressStats = progressData ? {
        total: progressData.length,
        completed: progressData.filter(p => p.status === progressStatus.COMPLETED).length,
        inProgress: progressData.filter(p => p.status === progressStatus.IN_PROGRESS).length,
        notStarted: progressData.filter(p => p.status === progressStatus.NOT_STARTED).length,
    } : { total: 0, completed: 0, inProgress: 0, notStarted: 0 };

    const completionRate = progressStats.total > 0 ? (progressStats.completed / progressStats.total) * 100 : 0;

    const features = [
        {
            title: "進捗確認",
            description: "タスクの進捗状況を確認・更新できます",
            icon: <TrendingUp color="primary" />,
            path: "/trainee/progress"
        },
    ];

    return (
        <Box sx={{ p: 3 }}>

            {/* 進捗サマリーカード */}
            <Card sx={{ mb: 4, background: "#5aa6f1ff", color: "white" }}>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                        <CheckCircle sx={{ mr: 1 }} />
                        進捗概要
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                            <Typography variant="body2">全体進捗</Typography>
                            <Typography variant="body2">{completionRate.toFixed(1)}%</Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={completionRate}
                            sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: "rgba(255, 255, 255, 0.3)",
                                "& .MuiLinearProgress-bar": {
                                    backgroundColor: "white"
                                }
                            }}
                        />
                    </Box>

                    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 2, mt: 3 }}>
                        <Box sx={{ textAlign: "center" }}>
                            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                                {progressStats.completed}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                完了
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: "center" }}>
                            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                                {progressStats.inProgress}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                進行中
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: "center" }}>
                            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                                {progressStats.notStarted}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                未着手
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: "center" }}>
                            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                                {progressStats.total}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                総タスク数
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* 機能カード */}
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 3, mb: 4 }}>
                {features.map((feature, index) => (
                    <Card
                        key={index}
                        sx={{
                            height: "100%",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: 3
                            }
                        }}
                        onClick={() => navigate(feature.path)}
                    >
                        <CardContent>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                {feature.icon}
                                <Typography variant="h6" component="h2" sx={{ ml: 1 }}>
                                    {feature.title}
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                {feature.description}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            {/* 機能リスト */}
            <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    利用可能な機能
                </Typography>
                <List>
                    <ListItem>
                        <ListItemIcon>
                            <TrendingUp />
                        </ListItemIcon>
                        <ListItemText
                            primary="進捗管理"
                            secondary="タスクの進捗状況を確認し、ステータスを更新できます"
                        />
                    </ListItem>
                </List>
            </Box>
        </Box>
    );
};