import { Box, Button, Typography, Autocomplete, TextField } from "@mui/material";
import { useState } from "react";
import { PhaseList, PhaseEditDialog } from "../../../features/phase";
import { editMode } from "../../../shared/type";
import type { Training } from "../../../entities/training";
import dayjs from 'dayjs';

export const AdminPhasePage = () => {
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [selectedTrainingId, setSelectedTrainingId] = useState<string | undefined>(undefined);

    // サンプル研修データ（実際のアプリケーションではAPIから取得）
    const trainings: Training[] = [
        {
            id: '1',
            title: 'React基礎研修',
            description: 'Reactの基礎を学ぶ研修',
            order: 1,
            startDate: dayjs('2025-02-01'),
            endDate: dayjs('2025-02-05'),
            updateDateTime: dayjs('2025-01-15 10:30'),
            updateUserId: 'user001'
        },
        {
            id: '2',
            title: 'TypeScript入門',
            description: 'TypeScriptの基礎を学ぶ研修',
            order: 2,
            startDate: dayjs('2025-02-10'),
            endDate: dayjs('2025-02-15'),
            updateDateTime: dayjs('2025-01-20 14:45'),
            updateUserId: 'user002'
        },
        {
            id: '3',
            title: 'Node.js実践',
            description: 'Node.jsでのサーバー開発を学ぶ研修',
            order: 3,
            startDate: dayjs('2025-02-20'),
            endDate: dayjs('2025-02-25'),
            updateDateTime: dayjs('2025-01-25 09:15'),
            updateUserId: 'user003'
        },
    ];

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
                    フェーズ一覧
                </Typography>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleCreateClick}
                >
                    新規フェーズ作成
                </Button>
            </Box>

            {/* 研修選択UI */}
            <Box sx={{
                padding: "16px",
                borderBottom: "1px solid #e0e0e0",
                backgroundColor: "#fafafa",
            }}>
                <Autocomplete
                    options={trainings}
                    getOptionLabel={(option) => option.title}
                    value={trainings.find(t => t.id === selectedTrainingId) || null}
                    onChange={(_, newValue) => setSelectedTrainingId(newValue?.id || undefined)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="研修を選択"
                            size="small"
                        />
                    )}
                    sx={{
                        width: "200px",
                    }}
                />
            </Box>

            <Box sx={{
                flex: 1,
            }}>
                <PhaseList selectedTrainingId={selectedTrainingId} />
            </Box>
            
            {/* 新規作成ダイアログ */}
            <PhaseEditDialog
                phaseId=""
                mode={editMode.CREATE}
                open={createDialogOpen}
                onClose={handleCreateDialogClose}
                trainingId={selectedTrainingId}
            />
        </Box>
    );
}
