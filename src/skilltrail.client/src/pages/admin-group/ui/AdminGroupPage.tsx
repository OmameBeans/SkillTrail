import React, { useState, Suspense } from 'react';
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Alert,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { GroupList } from '../../../features/group-list';
import { GroupEditDialog } from '../../../features/group-edit';
import { GroupDeleteDialog } from '../../../features/group-delete';
import type { Group } from '../../../entities/group';

export const AdminGroupPage: React.FC = () => {
    const [editingGroup, setEditingGroup] = useState<Group | null>(null);
    const [deletingGroup, setDeletingGroup] = useState<Group | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleCreateGroup = () => {
        setEditingGroup(null);
        setIsEditDialogOpen(true);
    };

    const handleEditGroup = (group: Group) => {
        setEditingGroup(group);
        setIsEditDialogOpen(true);
    };

    const handleDeleteGroup = (group: Group) => {
        setDeletingGroup(group);
        setIsDeleteDialogOpen(true);
    };

    const handleCloseEditDialog = () => {
        setIsEditDialogOpen(false);
        setEditingGroup(null);
    };

    const handleCloseDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
        setDeletingGroup(null);
    };

    const handleSuccess = () => {
        // クエリは自動的に無効化されるため、特別な処理は不要
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
                    グループ管理
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={handleCreateGroup}
                >
                    グループ追加
                </Button>
            </Box>

            <Box sx={{ flex: 1, px: 3, pb: 3 }}>
                <Suspense
                    fallback={
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            py: 8 
                        }}>
                            <CircularProgress />
                        </Box>
                    }
                >
                    <GroupList
                        onEdit={handleEditGroup}
                        onDelete={handleDeleteGroup}
                    />
                </Suspense>
            </Box>

            <GroupEditDialog
                isOpen={isEditDialogOpen}
                group={editingGroup}
                onClose={handleCloseEditDialog}
                onSuccess={handleSuccess}
            />

            <GroupDeleteDialog
                isOpen={isDeleteDialogOpen}
                group={deletingGroup}
                onClose={handleCloseDeleteDialog}
                onSuccess={handleSuccess}
            />
        </Box>
    );
};