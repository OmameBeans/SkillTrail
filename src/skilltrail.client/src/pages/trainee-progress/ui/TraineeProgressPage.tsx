import { Box, Typography } from "@mui/material";
import { ProgressDatagrid } from "../../../features/progress-datagrid";

export const TraineeProgressPage = () => {
    return (
        <Box sx={{
            display: 'flex',
            height: '100%',
            width: '100%',
            flexDirection: 'column',
        }}>
            <Box sx={{
                p: 2,
            }}>
                <Typography variant="h5">進捗管理</Typography>
            </Box>
            <Box sx={{
                flex: 1,
                display: 'flex',
                minHeight: 0,
            }}>
                <ProgressDatagrid />
            </Box>
        </Box>
    );
};