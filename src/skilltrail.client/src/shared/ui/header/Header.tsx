import { AppBar, Box, IconButton, Toolbar, Tooltip, Typography } from "@mui/material"
import { useCurrentUser } from "../../../features/current-user";
import { useNavigate } from "react-router-dom";
import { role } from "../../../entities/user";
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';

export const Header = () => {

    const { currentUser } = useCurrentUser();
    const navigation = useNavigate();
    const isAdmin = currentUser.role === role.ADMIN;

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
                        {isAdmin && (
                            <Typography
                                component="div"
                                onClick={() => navigation('/admin')}
                                sx={{
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                }}>
                                管理者
                            </Typography>
                        )}
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
                            <IconButton size="small">
                                <MilitaryTechIcon sx={{
                                    color: 'gold',
                                }} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}