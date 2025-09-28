import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    CircularProgress,
    Alert,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import type { Level } from "../../../entities/level";
import { useLevels } from "../../../entities/level";

type Props = {
    isOpen: boolean;
    onClose: () => void;
}

export const LevelDialog = (props: Props) => {
    const { data: levels, isLoading, error } = useLevels();

    const columns: GridColDef<Level>[] = [
        {
            field: "level",
            headerName: "レベル",
            width: 100,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: "experiencePoints",
            headerName: "取得経験値",
            width: 250,
            align: 'right',
            headerAlign: 'center',
            valueFormatter: (value: number) => value.toLocaleString(),
        },
        {
            field: "cumulativeExperiencePoints",
            headerName: "累計経験値",
            width: 250,
            align: 'right',
            headerAlign: 'center',
            valueFormatter: (value: number) => value.toLocaleString(),
        }
    ];

    const renderContent = () => {
        if (isLoading) {
            return (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 400,
                    }}
                >
                    <CircularProgress />
                </Box>
            );
        }

        if (error) {
            return (
                <Alert severity="error" sx={{ m: 2 }}>
                    経験値テーブルの読み込みに失敗しました
                </Alert>
            );
        }

        if (!levels || levels.length === 0) {
            return (
                <Alert severity="info" sx={{ m: 2 }}>
                    経験値データがありません
                </Alert>
            );
        }

        return (
            <Box sx={{
                width: "100%",
                height: "500px",
                display: "flex",
            }}>
                <DataGrid
                    columns={columns}
                    rows={levels}
                    getRowId={(row) => row.level}
                />
            </Box>
        );
    };

    return (
        <Dialog open={props.isOpen} onClose={props.onClose} fullWidth maxWidth="md">
            <DialogTitle>
                経験値テーブル
            </DialogTitle>
            <DialogContent>
                {renderContent()}
            </DialogContent>
            <DialogActions>
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    justifyContent: "end",
                }}>
                    <Button variant="outlined" onClick={props.onClose}>閉じる</Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};