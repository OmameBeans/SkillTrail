import { Box } from "@mui/material";
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
                flex: 1,
                display: 'flex',
                minHeight: 0,
                pt: 1,
            }}>
                <ProgressDatagrid />
            </Box>
        </Box>
    );
};