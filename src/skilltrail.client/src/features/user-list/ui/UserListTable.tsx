import { Box, Chip, Paper } from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Edit, Delete, Assessment } from '@mui/icons-material';
import type { User, Role } from '../../../entities/user/model/user';

const getRoleLabel = (userRole: Role): string => {
    switch (userRole) {
        case 2: // role.ADMIN
            return '管理者';
        case 1: // role.TRAINEE
            return '受講者';
        case 0: // role.NONE
        default:
            return '未設定';
    }
};

const getRoleColor = (userRole: Role) => {
    switch (userRole) {
        case 2: // role.ADMIN
            return 'error';
        case 1: // role.TRAINEE
            return 'primary';
        case 0: // role.NONE
        default:
            return 'default';
    }
};

interface UserListTableProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
    onEvaluate: (user: User) => void;
}

export const UserListTable = ({ users, onEdit, onDelete, onEvaluate }: UserListTableProps) => {
    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            minWidth: 150,
        },
        {
            field: 'name',
            headerName: '名前',
            minWidth: 500,
        },
        {
            field: 'groupName',
            headerName: 'グループ',
            minWidth: 200,
        },
        {
            field: 'role',
            headerName: '役割',
            minWidth: 150,
            renderCell: (params: GridRenderCellParams) => (
                <Box>
                    <Chip
                        label={getRoleLabel(params.value as Role)}
                        color={getRoleColor(params.value as Role)}
                        variant="outlined"
                        size="small"
                    />
                </Box>
            ),
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: '操作',
            minWidth: 200,
            getActions: (params) => {
                const user = params.row as User;
                const actions = [
                    <GridActionsCellItem
                        key="edit"
                        icon={<Edit />}
                        label="編集"
                        onClick={() => onEdit(user)}
                    />,
                    <GridActionsCellItem
                        key="delete"
                        icon={<Delete />}
                        label="削除"
                        onClick={() => onDelete(user)}
                    />,
                ];

                // 受講者（role = 1）の場合のみ評価ボタンを追加
                if (user.role === 1) {
                    actions.splice(0, 0,
                        <GridActionsCellItem
                            key="evaluate"
                            icon={<Assessment />}
                            label="評価"
                            onClick={() => onEvaluate(user)}
                        />
                    );
                }

                return actions;
            },
        },
    ];

    return (
        <Paper sx={{
            flex: 1,
            minHeight: '0',
            display: "flex",
            flexDirection: "column",
        }}>
            <DataGrid
                rows={users}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 100 },
                    },
                }}
                pageSizeOptions={[25, 50, 100]}
                disableRowSelectionOnClick
                sx={{ border: 0 }}
            />
        </Paper>
    );
};
