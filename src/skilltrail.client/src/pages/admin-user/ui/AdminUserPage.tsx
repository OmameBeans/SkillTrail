import { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Alert,
} from '@mui/material';
import { Add, Upload } from '@mui/icons-material';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../../../entities/user/api/queries';
import { UserListTable } from '../../../features/user-list';
import { UserEditDialog } from '../../../features/user-edit';
import { UserDeleteDialog } from '../../../features/user-delete';
import { UserCsvImportDialog } from '../../../features/user-csv-import'
import type { User, Role } from '../../../entities/user/model/user';

type UserFormData = {
    id: string;
    name: string;
    role: Role;
};

export const AdminUserPage = () => {
    const { data: users } = useUsers();
    const createUserMutation = useCreateUser();
    const updateUserMutation = useUpdateUser();
    const deleteUserMutation = useDeleteUser();

    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [csvImportOpen, setCsvImportOpen] = useState(false);

    const handleOpenCreateDialog = () => {
        setEditingUser(null);
        setOpenEditDialog(true);
    };

    const handleOpenEditDialog = (user: User) => {
        setEditingUser(user);
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setEditingUser(null);
    };

    const handleSubmitUser = async (formData: UserFormData) => {
        if (editingUser) {
            await updateUserMutation.mutateAsync({
                id: formData.id,
                name: formData.name,
                role: formData.role,
            });
        } else {
            await createUserMutation.mutateAsync({
                id: formData.id,
                name: formData.name,
                role: formData.role,
            });
        }
    };

    const handleDeleteClick = (user: User) => {
        setUserToDelete(user);
        setDeleteConfirmOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteConfirmOpen(false);
        setUserToDelete(null);
    };

    const handleDeleteConfirm = async () => {
        if (userToDelete) {
            await deleteUserMutation.mutateAsync(userToDelete.id);
        }
    };

    return (
        <Box sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <Box sx={{
                display: 'flex',
                p: 3,
                gap: 2,
                alignItems: 'center',
            }}>
                <Typography variant="h4" component="h1">
                    ユーザー管理
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={handleOpenCreateDialog}
                >
                    ユーザー追加
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<Upload />}
                    onClick={() => setCsvImportOpen(true)}
                >
                    CSVインポート
                </Button>
            </Box>

            {(createUserMutation.error || updateUserMutation.error || deleteUserMutation.error) && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {createUserMutation.error?.message ||
                        updateUserMutation.error?.message ||
                        deleteUserMutation.error?.message}
                </Alert>
            )}

            <UserListTable
                users={users}
                onEdit={handleOpenEditDialog}
                onDelete={handleDeleteClick}
            />

            <UserEditDialog
                open={openEditDialog}
                user={editingUser}
                onClose={handleCloseEditDialog}
                onSubmit={handleSubmitUser}
                isLoading={createUserMutation.isPending || updateUserMutation.isPending}
            />

            <UserDeleteDialog
                open={deleteConfirmOpen}
                user={userToDelete}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleDeleteConfirm}
                isLoading={deleteUserMutation.isPending}
            />

            <UserCsvImportDialog
                open={csvImportOpen}
                onClose={() => setCsvImportOpen(false)}
            />
        </Box>
    );
};
