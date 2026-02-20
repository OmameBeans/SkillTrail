import { AppBar, Box, IconButton, Toolbar, Tooltip, Typography } from "@mui/material"
import { useCurrentUser } from "../../../features/current-user";
import { useNavigate } from "react-router-dom";
import { role } from "../../../entities/user";
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import { useState } from "react";
import { UserLevelDialog } from "../../../widgets/user-level-dialog";
import SettingsIcon from '@mui/icons-material/Settings';
import FeedbackIcon from '@mui/icons-material/Feedback';
import HomeIcon from '@mui/icons-material/Home';

export const Header = () => {

    const { currentUser } = useCurrentUser();
    const navigation = useNavigate();
    const isAdmin = currentUser.role === role.ADMIN;
    const [userLevelDialogOpen, setUserLevelDialogOpen] = useState(false);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Box sx={{
                        flexGrow: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                    }}>
                        <Typography variant="h6" component="div" onClick={() => navigation('/trainee')} sx={{ cursor: 'pointer' }}>
                            進捗管理
                        </Typography>
                        <Typography
                            component="div"
                            onClick={() => navigation('/trainee')}
                            sx={{
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 0.5,
                            }}>
                            <HomeIcon fontSize="small"/>
                            ホーム
                        </Typography>
                        {isAdmin && (
                            <Typography
                                component="div"
                                onClick={() => navigation('/admin')}
                                sx={{
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                }}>
                                <SettingsIcon fontSize="small"/>
                                管理者ページ
                            </Typography>
                        )}
                        <Typography
                            component="div"
                            onClick={() => navigation('/feedback')}
                            sx={{
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                            }}>
                            <FeedbackIcon fontSize="small"/>
                            フィードバック
                        </Typography>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        justifyContent: 'end',
                    }}>
                        <Typography variant="body1" component="div">
                            {`${currentUser.id} ${currentUser.name}`}
                        </Typography>
                        <Tooltip title="レベルを確認する">
                            <IconButton size="small" onClick={() => setUserLevelDialogOpen(true)}>
                                <MilitaryTechIcon sx={{
                                    color: 'gold',
                                }} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Toolbar>
            </AppBar>
            {userLevelDialogOpen && (
                <UserLevelDialog isOpen={userLevelDialogOpen} onClose={() => setUserLevelDialogOpen(false)} />
            )}
        </Box>
    );
}