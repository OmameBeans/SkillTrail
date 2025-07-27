import { Box } from "@mui/material";
import { DataGrid, type GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { useState } from "react";
import type { Phase } from '../../../entities/phase';
import dayjs from 'dayjs';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { PhaseEditDialog } from './PhaseEditDialog';
import type { EditMode } from '../../../shared/type';
import { editMode } from '../../../shared/type';

interface PhaseListProps {
    selectedTrainingId?: string;
}

export const PhaseList = ({ selectedTrainingId }: PhaseListProps) => {
    const [editDialog, setEditDialog] = useState<{
        open: boolean;
        phaseId: string;
        mode: EditMode;
    }>({
        open: false,
        phaseId: '',
        mode: editMode.CREATE
    });

    const handleEdit = (id: string | number) => {
        console.log('編集:', id);
        setEditDialog({
            open: true,
            phaseId: String(id),
            mode: editMode.UPDATE
        });
    };

    const handleDelete = (id: string | number) => {
        console.log('削除:', id);
        // TODO: 削除確認ダイアログの表示
        if (window.confirm(`フェーズID: ${id} を削除しますか？`)) {
            // TODO: API呼び出しで削除処理
            alert(`フェーズID: ${id} を削除しました`);
        }
    };

    const handleCloseDialog = () => {
        setEditDialog(prev => ({ ...prev, open: false }));
    };

    const columns: GridColDef<Phase>[] = [
        {
            field: 'name',
            headerName: 'フェーズ名',
            width: 200,
            editable: true,
        },
        {
            field: 'description',
            headerName: '説明',
            width: 350,
            editable: true,
        },
        {
            field: 'order',
            headerName: '実施順',
            width: 100,
            editable: true,
            type: 'number',
        },
        {
            field: 'startDate',
            headerName: '開始日',
            width: 130,
            editable: true,
            valueGetter: (value) => value ? dayjs(value).format('YYYY/MM/DD') : '',
        },
        {
            field: 'endDate',
            headerName: '終了日',
            width: 130,
            editable: true,
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
    const rows: Phase[] = [
        {
            id: '1',
            name: '基礎学習フェーズ',
            trainingId: '1',
            description: 'React基礎研修の基礎学習部分',
            order: 1,
            startDate: dayjs('2025-02-01'),
            endDate: dayjs('2025-02-02'),
            updateDateTime: dayjs('2025-01-15 10:30'),
            updateUserId: 'user001'
        },
        {
            id: '2',
            name: '実践演習フェーズ',
            trainingId: '1',
            description: 'React基礎研修の実践演習部分',
            order: 2,
            startDate: dayjs('2025-02-03'),
            endDate: dayjs('2025-02-05'),
            updateDateTime: dayjs('2025-01-15 10:30'),
            updateUserId: 'user001'
        },
        {
            id: '3',
            name: '型システム学習',
            trainingId: '2',
            description: 'TypeScript入門の型システム学習',
            order: 1,
            startDate: dayjs('2025-02-10'),
            endDate: dayjs('2025-02-12'),
            updateDateTime: dayjs('2025-01-20 14:45'),
            updateUserId: 'user002'
        },
    ];

    { console.log('selectedTrainingId:', selectedTrainingId) }
    { console.log('editDialog:', editDialog) }

    // フィルタリング済みのフェーズデータ
    const filteredRows = selectedTrainingId
        ? rows.filter(row => row.trainingId === selectedTrainingId)
        : rows;

    return (
        <Box sx={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
        }}>
            {/* データグリッド */}
            <Box sx={{ flex: 1 }}>
                <DataGrid
                    rows={filteredRows}
                    columns={columns}
                />
            </Box>

            {editDialog.open && (
                <>
                    <PhaseEditDialog
                        phaseId={editDialog.phaseId}
                        mode={editDialog.mode}
                        open={editDialog.open}
                        onClose={handleCloseDialog}
                        trainingId={selectedTrainingId}
                    />
                </>
            )}
        </Box>
    );
}
