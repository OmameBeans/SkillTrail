import { Box, Typography, Card, CardContent, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Task, Person } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export const AdminHomePage = () => {
    const navigate = useNavigate();

    const features = [
        {
            title: "ユーザー管理",
            description: "ユーザーの作成、編集、削除、役割管理が可能です",
            icon: <Person color="primary" />,
            path: "/admin/user"
        },
        {
            title: "タスク管理",
            description: "学習タスクの作成、編集、削除が可能です",
            icon: <Task color="primary" />,
            path: "/admin/task"
        },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
                管理画面
            </Typography>

            <Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
                SkillTrail管理システムへようこそ。以下の機能をご利用いただけます。
            </Typography>

            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 3 }}>
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

            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    利用可能な機能
                </Typography>
                <List>
                    <ListItem>
                        <ListItemIcon>
                            <Person />
                        </ListItemIcon>
                        <ListItemText
                            primary="ユーザー管理"
                            secondary="ユーザーの追加、編集、削除、役割管理"
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <Task />
                        </ListItemIcon>
                        <ListItemText
                            primary="タスク管理"
                            secondary="学習タスクの追加、編集、削除、カテゴリ管理"
                        />
                    </ListItem>
                </List>
            </Box>
        </Box>
    );
};
