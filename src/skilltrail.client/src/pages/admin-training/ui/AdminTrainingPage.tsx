import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { TrainingList } from "../../../features/training";
import { TrainingEditDialog } from "../../../features/training/ui/TrainingEditDialog";
import { editMode } from "../../../shared/type";

export const AdminTrainingsPage = () => {
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const handleCreateClick = () => {
        setCreateDialogOpen(true);
    };

    const handleCreateDialogClose = () => {
        setCreateDialogOpen(false);
    };

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%",
        }}>
            <Box sx={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "20px",
            }}>
                <Typography variant="h4" component="h1">
                    研修一覧
                </Typography>
                <Button 
                    variant="outlined" 
                    color="primary"
                    onClick={handleCreateClick}
                >
                    新規研修作成
                </Button>
            </Box>
            <Box sx={{
                flex: 1,
            }}>
                <TrainingList />
            </Box>
            
            {/* 新規作成ダイアログ */}
            <TrainingEditDialog
                trainingId=""
                mode={editMode.CREATE}
                open={createDialogOpen}
                onClose={handleCreateDialogClose}
            />
        </Box>
    );
}