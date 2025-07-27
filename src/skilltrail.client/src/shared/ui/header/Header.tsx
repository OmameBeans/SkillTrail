import { AppBar, Box, Toolbar, Typography } from "@mui/material"
import { useCurrentUser } from "../../../features/current-user";

export const Header = () => {

    const { currentUser } = useCurrentUser();

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        SkillTrail
                    </Typography>
                    <Typography variant="body1" component="div">
                        {`${currentUser.id} ${currentUser.name}`}
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    );
}