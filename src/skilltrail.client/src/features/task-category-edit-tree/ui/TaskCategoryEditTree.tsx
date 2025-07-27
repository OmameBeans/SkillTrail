import { useState, useEffect } from 'react';
import { 
    Box, 
    List, 
    ListItem, 
    ListItemText, 
    IconButton, 
    TextField, 
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Paper,
    Typography
} from '@mui/material';
import { 
    DndContext, 
    DragOverlay, 
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { 
    SortableContext, 
    useSortable, 
    verticalListSortingStrategy,
    arrayMove
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useSearchParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';
import type { TaskCategory } from '../../../entities/task-category';
import { 
    useTaskCategories, 
    useCreateTaskCategory, 
    useUpdateTaskCategory, 
    useDeleteTaskCategory, 
    useReorderTaskCategories,
    taskCategoryKeys
} from '../../../entities/task-category';
import { useQueryClient } from '@tanstack/react-query';

// ソート可能なリストアイテムコンポーネント
interface SortableItemProps {
    category: TaskCategory;
    onEdit: (category: TaskCategory) => void;
    onDelete: (id: string) => void;
    onSelect: (id: string) => void;
    isSelected: boolean;
}

const SortableItem = ({ category, onEdit, onDelete, onSelect, isSelected }: SortableItemProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: category.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <ListItem
            ref={setNodeRef}
            style={style}
            sx={{
                backgroundColor: isSelected ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                borderLeft: isSelected ? '3px solid' : '3px solid transparent',
                borderLeftColor: isSelected ? 'primary.main' : 'transparent',
                cursor: 'pointer',
                '&:hover': {
                    backgroundColor: isSelected ? 'rgba(25, 118, 210, 0.12)' : 'action.hover',
                },
                mb: 1,
                border: '1px solid rgba(0, 0, 0, 0.12)',
                borderRadius: 1,
            }}
            onClick={() => onSelect(category.id)}
        >
            <IconButton
                {...attributes}
                {...listeners}
                size="small"
                sx={{ mr: 1, cursor: 'grab' }}
            >
                <DragIndicatorIcon />
            </IconButton>
            <ListItemText 
                primary={category.title}
                secondary={category.description}
            />
            <IconButton 
                size="small" 
                onClick={(e) => {
                    e.stopPropagation();
                    onEdit(category);
                }}
                sx={{
                    opacity: 0.3,
                    '&:hover': {
                        opacity: 1,
                    },
                }}
            >
                <EditIcon />
            </IconButton>
            <IconButton 
                size="small" 
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(category.id);
                }}
                sx={{
                    opacity: 0.3,
                    '&:hover': {
                        opacity: 1,
                    },
                }}
            >
                <DeleteIcon />
            </IconButton>
        </ListItem>
    );
};

// 編集ダイアログコンポーネント
interface EditDialogProps {
    open: boolean;
    category: TaskCategory | null;
    onClose: () => void;
    onSave: (category: Omit<TaskCategory, 'id'> | TaskCategory) => void;
    isCreate: boolean;
    enqueueSnackbar: (message: string, options?: { variant?: 'success' | 'error' | 'warning' | 'info' }) => void;
}

const EditDialog = ({ open, category, onClose, onSave, isCreate, enqueueSnackbar }: EditDialogProps) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (category) {
            setName(category.title);
            setDescription(category.description || '');
        } else {
            setName('');
            setDescription('');
        }
    }, [category]);

    const handleSave = () => {
        if (!name.trim()) {
            enqueueSnackbar('カテゴリ名は必須です', { variant: 'error' });
            return;
        }

        if (isCreate) {
            // 新規作成
            const newCategory: Omit<TaskCategory, 'id'> = {
                categoryId: '', // 親カテゴリIDは空文字列
                title: name.trim(),
                order: 0, // サーバー側で適切な値を設定
                description: description.trim(),
                updateDateTime: dayjs(),
                updateUserId: 'current-user'
            };
            onSave(newCategory);
        } else {
            // 更新
            const updatedCategory: TaskCategory = {
                ...category!,
                title: name.trim(),
                description: description.trim(),
                updateDateTime: dayjs(),
                updateUserId: 'current-user'
            };
            onSave(updatedCategory);
        }

        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {isCreate ? '新しいカテゴリを作成' : 'カテゴリを編集'}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                    <TextField
                        label="カテゴリ名"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        required
                    />
                    <TextField
                        label="説明"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        multiline
                        rows={3}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSave} variant="contained">
                    {isCreate ? '作成' : '更新'}
                </Button>
                <Button onClick={onClose} variant="outlined">
                    キャンセル
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export const TaskCategoryEditTree = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient();
    const [editDialog, setEditDialog] = useState<{
        open: boolean;
        category: TaskCategory | null;
        isCreate: boolean;
    }>({
        open: false,
        category: null,
        isCreate: false
    });
    const [activeId, setActiveId] = useState<string | null>(null);

    // API呼び出し
    const { data: categories } = useTaskCategories();
    const createMutation = useCreateTaskCategory();
    const updateMutation = useUpdateTaskCategory();
    const deleteMutation = useDeleteTaskCategory();
    const reorderMutation = useReorderTaskCategories();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    // 選択されたカテゴリID
    const selectedCategoryId = searchParams.get('cid') || '';

    // カテゴリを選択
    const handleSelectCategory = (id: string) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('cid', id);
        setSearchParams(newSearchParams);
    };

    // 新規作成
    const handleCreate = () => {
        setEditDialog({
            open: true,
            category: null,
            isCreate: true
        });
    };

    // 編集
    const handleEdit = (category: TaskCategory) => {
        setEditDialog({
            open: true,
            category,
            isCreate: false
        });
    };

    // 削除
    const handleDelete = async (id: string) => {
        if (window.confirm('このカテゴリを削除しますか？')) {
            deleteMutation.mutate(id, {
                onSuccess: () => {
                    enqueueSnackbar('カテゴリを削除しました', { variant: 'success' });
                    // 削除されたカテゴリが選択されていた場合、選択を解除
                    if (selectedCategoryId === id) {
                        const newSearchParams = new URLSearchParams(searchParams);
                        newSearchParams.delete('cid');
                        setSearchParams(newSearchParams);
                    }
                },
                onError: (error) => {
                    console.error('削除エラー:', error);
                    enqueueSnackbar('削除に失敗しました', { variant: 'error' });
                }
            });
        }
    };

    // 保存
    const handleSave = async (savedCategory: Omit<TaskCategory, 'id'> | TaskCategory) => {
        if (editDialog.isCreate) {
            createMutation.mutate(savedCategory as Omit<TaskCategory, 'id'>, {
                onSuccess: () => {
                    enqueueSnackbar('カテゴリを作成しました', { variant: 'success' });
                },
                onError: (error) => {
                    console.error('保存エラー:', error);
                    enqueueSnackbar('作成に失敗しました', { variant: 'error' });
                }
            });
        } else {
            updateMutation.mutate(savedCategory as TaskCategory, {
                onSuccess: () => {
                    enqueueSnackbar('カテゴリを更新しました', { variant: 'success' });
                },
                onError: (error) => {
                    console.error('保存エラー:', error);
                    enqueueSnackbar('更新に失敗しました', { variant: 'error' });
                }
            });
        }
    };

    // ドラッグ開始
    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    // ドラッグ終了
    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = categories.findIndex(item => item.id === active.id);
            const newIndex = categories.findIndex(item => item.id === over?.id);
            
            const newItems = arrayMove(categories, oldIndex, newIndex);
            // orderフィールドを更新
            const updatedItems = newItems.map((item, index) => ({
                ...item,
                order: index
            }));
            const categoryIds = newItems.map(item => item.id);
            
            // 楽観的更新：先にローカルキャッシュを更新
            const previousCategories = queryClient.getQueryData(taskCategoryKeys.lists());
            
            // ローカルキャッシュを即座に更新
            queryClient.setQueryData(taskCategoryKeys.lists(), updatedItems);
            
            // ミューテーションを実行
            reorderMutation.mutate(categoryIds, {
                onSuccess: () => {
                    enqueueSnackbar('並び順を変更しました', { variant: 'success' });
                },
                onError: (error) => {
                    // エラー時は元のデータに戻す
                    queryClient.setQueryData(taskCategoryKeys.lists(), previousCategories);
                    console.error('並び順変更エラー:', error);
                    enqueueSnackbar('並び順変更に失敗しました', { variant: 'error' });
                }
            });
        }

        setActiveId(null);
    };

    // ダイアログを閉じる
    const handleCloseDialog = () => {
        setEditDialog({
            open: false,
            category: null,
            isCreate: false
        });
    };

    // ドラッグ中のアイテム
    const activeDragItem = activeId ? categories.find(cat => cat.id === activeId) : null;

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* ヘッダー */}
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6">タスクカテゴリ</Typography>
                    <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={handleCreate}
                        size="small"
                        disabled={createMutation.isPending}
                    >
                        新規作成
                    </Button>
                </Box>
                <Typography variant="body2" color="textSecondary">
                    ドラッグ＆ドロップで順番を変更できます
                </Typography>
            </Box>

            {/* カテゴリリスト */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={categories.map(cat => cat.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <List>
                            {categories
                                .sort((a, b) => a.order - b.order)
                                .map((category) => (
                                    <SortableItem
                                        key={category.id}
                                        category={category}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onSelect={handleSelectCategory}
                                        isSelected={selectedCategoryId === category.id}
                                    />
                                ))}
                        </List>
                    </SortableContext>

                    <DragOverlay>
                        {activeDragItem ? (
                            <Paper
                                sx={{
                                    p: 2,
                                    backgroundColor: 'background.paper',
                                    boxShadow: 3,
                                    opacity: 0.9
                                }}
                            >
                                <Typography variant="body1">{activeDragItem.title}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {activeDragItem.description}
                                </Typography>
                            </Paper>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </Box>

            {/* 編集ダイアログ */}
            <EditDialog
                open={editDialog.open}
                category={editDialog.category}
                onClose={handleCloseDialog}
                onSave={handleSave}
                isCreate={editDialog.isCreate}
                enqueueSnackbar={enqueueSnackbar}
            />
        </Box>
    );
};