import { Box } from "@mui/material";
import { DataGrid, type GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { useState } from "react";
import type { Training } from '../../../entities/training';
import { editMode } from '../../../shared/type';
import { TrainingEditDialog } from './TrainingEditDialog';
import dayjs from 'dayjs';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export const TrainingList = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedTrainingId, setSelectedTrainingId] = useState<string>('');

    const handleEdit = (id: string | number) => {
        console.log('編集:', id);
        setSelectedTrainingId(String(id));
        setDialogOpen(true);
    };

    const handleDelete = (id: string | number) => {
        console.log('削除:', id);
        // TODO: 削除確認ダイアログの表示
        if (window.confirm(`研修ID: ${id} を削除しますか？`)) {
            // TODO: API呼び出しで削除処理
            alert(`研修ID: ${id} を削除しました`);
        }
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setSelectedTrainingId('');
    };

    const columns: GridColDef<Training>[] = [
        {
            field: 'title',
            headerName: 'タイトル',
            width: 250,
        },
        {
            field: 'description',
            headerName: '説明',
            width: 300,
        },
        {
            field: 'order',
            headerName: '実施順',
            width: 100,
            type: 'number',
        },
        {
            field: 'startDate',
            headerName: '開始日',
            width: 130,
            valueGetter: (value) => value ? dayjs(value).format('YYYY/MM/DD') : '',
        },
        {
            field: 'endDate',
            headerName: '終了日',
            width: 130,
            valueGetter: (value) => value ? dayjs(value).format('YYYY/MM/DD') : '',
        },
        {
            field: 'updateDateTime',
            headerName: '更新日時',
            width: 180,
            editable: false,
            valueGetter: (value) => value ? dayjs(value).format('YYYY/MM/DD HH:mm') : '',
        },
        {
            field: 'updateUserId',
            headerName: '更新者ID',
            width: 150,
            editable: false,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: '操作',
            width: 120,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                return [
                    <GridActionsCellItem
                        icon={<EditIcon sx={{ color: 'primary.main', opacity: 0.6 }} />}
                        label="編集"
                        onClick={() => handleEdit(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon sx={{ color: 'error.main', opacity: 0.6 }} />}
                        label="削除"
                        onClick={() => handleDelete(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];

    // サンプルデータ（実際のアプリケーションではAPIから取得）
    const rows: Training[] = [
        {
            id: '1',
            title: 'React基礎研修',
            description: 'Reactの基本的な概念と使い方を学ぶ研修',
            order: 1,
            startDate: dayjs('2025-02-01'),
            endDate: dayjs('2025-02-05'),
            updateDateTime: dayjs('2025-01-15 10:30'),
            updateUserId: 'user001'
        },
        {
            id: '2',
            title: 'TypeScript入門',
            description: 'TypeScriptの型システムと基本文法を習得する',
            order: 2,
            startDate: dayjs('2025-02-10'),
            endDate: dayjs('2025-02-12'),
            updateDateTime: dayjs('2025-01-20 14:45'),
            updateUserId: 'user002'
        },
        {
            id: '3',
            title: 'データベース設計',
            description: 'リレーショナルデータベースの設計手法を学ぶ',
            order: 3,
            startDate: dayjs('2025-02-17'),
            endDate: dayjs('2025-02-21'),
            updateDateTime: dayjs('2025-01-25 09:15'),
            updateUserId: 'user001'
        },
    ];

    return (
        <Box sx={{
            height: "100%",
            width: "100%",
            display: "flex",
        }}>
            <DataGrid
                rows={rows}
                columns={columns}
            />
            
            {/* 編集ダイアログ */}
            <TrainingEditDialog
                trainingId={selectedTrainingId}
                mode={editMode.UPDATE}
                open={dialogOpen}
                onClose={handleDialogClose}
            />
        </Box>
    );
}