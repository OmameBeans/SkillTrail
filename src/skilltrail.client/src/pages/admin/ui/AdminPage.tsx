import { Box, List, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { AdminAuth } from "./AdminAuth";

export const AdminPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { label: "ホーム", path: "/admin" },
        { label: "ユーザー管理", path: "/admin/user" },
        { label: "グループ管理", path: "/admin/group" },
        { label: "タスク管理", path: "/admin/task" },
    ];

    const handleMenuClick = (path: string) => {
        navigate(path);
    };

    return (
        <AdminAuth>
            <Box sx={{
                display: "flex",
                height: "100%",
            }}>
                <Box sx={{
                    width: "200px",
                    minWidth: "200px",
                    height: "100%",
                    borderRight: "1px solid var(--var-border-color)",
                }}>
                    <Typography variant="h6" sx={{ p: 2 }}>
                        管理メニュー
                    </Typography>
                    <List>
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <ListItem key={item.path} disablePadding>
                                    <ListItemButton
                                        onClick={() => handleMenuClick(item.path)}
                                        selected={isActive}
                                        sx={{
                                            backgroundColor: isActive ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                                            color: isActive ? 'primary.main' : 'inherit',
                                            borderLeft: isActive ? '3px solid' : '3px solid transparent',
                                            borderLeftColor: isActive ? 'primary.main' : 'transparent',
                                            '&:hover': {
                                                backgroundColor: isActive ? 'rgba(25, 118, 210, 0.12)' : 'action.hover',
                                            },
                                            '&.Mui-selected': {
                                                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                                color: 'primary.main',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(25, 118, 210, 0.12)',
                                                },
                                            },
                                        }}
                                    >
                                        <ListItemText primary={item.label} />
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                </Box>
                <Box sx={{
                    flex: 1,
                    minHeight: 0,
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    <Outlet />
                </Box>
            </Box>
        </AdminAuth>
    );
}