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
    Typography,
    Chip,
    Tooltip
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
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import type { Task } from '../../../entities/task';
import type { TaskCategory } from '../../../entities/task-category';
import {
    useTasks,
    useCreateTask,
    useUpdateTask,
    useDeleteTask,
    useReorderTasks,
    taskKeys
} from '../../../entities/task';
import { useTaskCategories } from '../../../entities/task-category';
import { LevelDialog } from '../../../widgets/level-dialog';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';

// ソート可能なリストアイテムコンポーネント
interface SortableItemProps {
    task: Task;
    category: TaskCategory | undefined;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
    isDragDisabled?: boolean;
}

const SortableItem = ({ task, category, onEdit, onDelete, isDragDisabled = false }: SortableItemProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        disabled: isDragDisabled
    });

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
                mb: 1,
                border: '1px solid rgba(0, 0, 0, 0.12)',
                borderRadius: 1,
                backgroundColor: 'background.paper',
                '&:hover': {
                    backgroundColor: 'action.hover',
                },
            }}
        >
            {!isDragDisabled && (
                <IconButton
                    {...attributes}
                    {...listeners}
                    size="small"
                    sx={{ mr: 1, cursor: 'grab' }}
                >
                    <DragIndicatorIcon />
                </IconButton>
            )}
            <Box sx={{ flex: 1 }}>
                <ListItemText
                    primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1">{task.title}</Typography>
                            {category && (
                                <Chip
                                    label={category.title}
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                />
                            )}
                            <Chip
                                label={`レベル ${task.level}`}
                                size="small"
                                variant="outlined"
                            />
                        </Box>
                    }
                    secondary={task.description}
                />
            </Box>
            <IconButton
                size="small"
                onClick={() => onEdit(task)}
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
                onClick={() => onDelete(task.id)}
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
    task: Task | null;
    categories: TaskCategory[];
    onClose: () => void;
    onSave: (task: Task | Omit<Task, 'id'>) => void;
    isCreate: boolean;
    selectedCategoryId: string;
}

const EditDialog = ({ open, task, categories, onClose, onSave, isCreate, selectedCategoryId }: EditDialogProps) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [level, setLevel] = useState(1);
    const [levelDialogOpen, setLevelDialogOpen] = useState(false);

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description || '');
            setCategoryId(task.categoryId);
            setLevel(task.level);
        } else {
            setTitle('');
            setDescription('');
            setCategoryId(selectedCategoryId);
            setLevel(1);
        }
    }, [task, selectedCategoryId]);

    const handleSave = () => {
        if (!title.trim()) {
            alert('タスクタイトルは必須です');
            return;
        }

        if (!categoryId) {
            alert('カテゴリを選択してください');
            return;
        }

        if (isCreate) {
            // 新規作成時はIDを含まない
            const newTask: Omit<Task, 'id'> = {
                title: title.trim(),
                categoryId,
                description: description.trim(),
                order: 0, // APIまたはhandleSaveで適切に設定される
                level: level,
                updateDateTime: dayjs(),
                updateUserId: 'current-user'
            };
            onSave(newTask as Task); // TaskEditListのhandleSaveではTask型を期待している
        } else {
            // 更新時はIDを含む
            const savedTask: Task = {
                id: task!.id,
                title: title.trim(),
                categoryId,
                description: description.trim(),
                order: task?.order || 0,
                level: level,
                updateDateTime: dayjs(),
                updateUserId: 'current-user'
            };
            onSave(savedTask);
        }

        onClose();
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {isCreate ? '新しいタスクを作成' : 'タスクを編集'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                        <TextField
                            label="タスクタイトル"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            fullWidth
                            required
                        />
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            justifyContent: 'space-between'
                        }}>
                            <TextField
                                label="レベル(1から50の範囲で設定してください)"
                                type="number"
                                fullWidth
                                value={level}
                                onChange={(e) => setLevel(Number(e.target.value))}
                                inputProps={{ min: 1, max: 50 }}
                            />
                            <Tooltip title="経験値テーブル">
                                <IconButton
                                    size="small"
                                    onClick={() => setLevelDialogOpen(true)}
                                >
                                    <InfoOutlineIcon fontSize="small" color='primary' />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <TextField
                            label="カテゴリ"
                            select
                            SelectProps={{ native: true }}
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            fullWidth
                            required
                        >
                            <option value="">カテゴリを選択</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.title}
                                </option>
                            ))}
                        </TextField>
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
            {
                levelDialogOpen && (
                    <LevelDialog
                        isOpen={levelDialogOpen}
                        onClose={() => setLevelDialogOpen(false)}
                    />
                )
            }
        </>
    );
};

export const TaskEditList = () => {
    const [searchParams] = useSearchParams();
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient();
    const [editDialog, setEditDialog] = useState<{
        open: boolean;
        task: Task | null;
        isCreate: boolean;
    }>({
        open: false,
        task: null,
        isCreate: false
    });
    const [activeId, setActiveId] = useState<string | null>(null);

    // 選択されたカテゴリID
    const selectedCategoryId = searchParams.get('cid') || '';

    // API呼び出し - cidの有無に応じて全件取得とカテゴリ別取得を切り替え
    const { data: categories } = useTaskCategories();
    const { data: tasks, refetch } = useTasks(selectedCategoryId || undefined);
    const createMutation = useCreateTask();
    const updateMutation = useUpdateTask();
    const deleteMutation = useDeleteTask();
    const reorderMutation = useReorderTasks();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    // 新規作成
    const handleCreate = () => {
        setEditDialog({
            open: true,
            task: null,
            isCreate: true
        });
    };

    // 編集
    const handleEdit = (task: Task) => {
        setEditDialog({
            open: true,
            task,
            isCreate: false
        });
    };

    // 削除
    const handleDelete = (id: string) => {
        if (window.confirm('このタスクを削除しますか？')) {
            deleteMutation.mutateAsync(id)
                .then(() => {
                    enqueueSnackbar('タスクを削除しました', { variant: 'success' });
                    refetch(); // データを再取得
                })
                .catch((error: Error) => {
                    console.error('削除エラー:', error);
                    enqueueSnackbar('削除に失敗しました', { variant: 'error' });
                });
        }
    };

    // 保存
    const handleSave = (savedTask: Task | Omit<Task, 'id'>) => {
        if (editDialog.isCreate) {
            // 新規作成の場合、同じカテゴリ内での最大order値+1を設定
            const categoryTasks = tasks.filter(task => task.categoryId === savedTask.categoryId);
            const maxOrder = Math.max(...categoryTasks.map(task => task.order), 0);
            const newTask = { ...savedTask, order: maxOrder + 1 };

            createMutation.mutateAsync(newTask as Omit<Task, 'id'>)
                .then(() => {
                    enqueueSnackbar('タスクを作成しました', { variant: 'success' });
                    refetch(); // データを再取得
                })
                .catch((error: Error) => {
                    console.error('作成エラー:', error);
                    enqueueSnackbar('作成に失敗しました', { variant: 'error' });
                });
        } else {
            updateMutation.mutateAsync(savedTask as Task)
                .then(() => {
                    enqueueSnackbar('タスクを更新しました', { variant: 'success' });
                    refetch(); // データを再取得
                })
                .catch((error: Error) => {
                    console.error('更新エラー:', error);
                    enqueueSnackbar('更新に失敗しました', { variant: 'error' });
                });
        }
    };

    // ドラッグ開始
    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    // ドラッグ終了
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = tasks.findIndex(item => item.id === active.id);
            const newIndex = tasks.findIndex(item => item.id === over?.id);

            const newItems = arrayMove(tasks, oldIndex, newIndex);
            // orderフィールドを更新
            const updatedItems = newItems.map((item, index) => ({
                ...item,
                order: index
            }));

            const taskIds = newItems.map(item => item.id);

            // 楽観的更新：先にローカルキャッシュを更新
            const queryKey = taskKeys.byCategory(selectedCategoryId)
            const previousTasks = queryClient.getQueryData(queryKey);

            // ローカルキャッシュを即座に更新
            queryClient.setQueryData(queryKey, updatedItems);

            // ミューテーションを実行
            reorderMutation.mutate({ categoryId: selectedCategoryId, taskIds }, {
                onSuccess: () => {
                    enqueueSnackbar('並び順を変更しました', { variant: 'success' });
                    refetch(); // データを再取得して最新状態を確保
                },
                onError: (error) => {
                    // エラー時は元のデータに戻す
                    queryClient.setQueryData(queryKey, previousTasks);
                    console.error('並び順変更エラー:', error);
                    enqueueSnackbar('並び順変更に失敗しました', { variant: 'error' });
                    refetch(); // エラー時もrefetchでサーバーの最新状態に同期
                }
            });
        }

        setActiveId(null);
    };

    // ダイアログを閉じる
    const handleCloseDialog = () => {
        setEditDialog({
            open: false,
            task: null,
            isCreate: false
        });
    };

    // ドラッグ中のアイテム
    const activeDragItem = activeId ? tasks.find(task => task.id === activeId) : null;
    const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* ヘッダー */}
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6">
                        タスク一覧
                        {selectedCategory && (
                            <Chip
                                label={selectedCategory.title}
                                size="small"
                                color="primary"
                                sx={{ ml: 1 }}
                            />
                        )}
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={handleCreate}
                        size="small"
                    >
                        新規作成
                    </Button>
                </Box>
                <Typography variant="body2" color="textSecondary">
                    {selectedCategoryId
                        ? 'ドラッグ＆ドロップで順番を変更できます'
                        : 'すべてのタスクを表示しています。カテゴリを選択すると、ドラッグ＆ドロップで順番を変更できます。'
                    }
                </Typography>
            </Box>

            {/* タスクリスト */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
                {tasks.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body1" color="textSecondary">
                            {selectedCategoryId ? 'このカテゴリにはタスクがありません' : 'タスクがありません'}
                        </Typography>
                    </Box>
                ) : selectedCategoryId ? (
                    // カテゴリが選択されている場合：ドラッグアンドドロップ有効
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={tasks.map(task => task.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <List>
                                {tasks
                                    .sort((a, b) => a.order - b.order)
                                    .map((task) => {
                                        const category = categories.find(cat => cat.id === task.categoryId);
                                        return (
                                            <SortableItem
                                                key={task.id}
                                                task={task}
                                                category={category}
                                                onEdit={handleEdit}
                                                onDelete={handleDelete}
                                                isDragDisabled={false}
                                            />
                                        );
                                    })}
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
                ) : (
                    // カテゴリが選択されていない場合：ドラッグアンドドロップ無効
                    <List>
                        {tasks
                            .map((task) => {
                                const category = categories.find(cat => cat.id === task.categoryId);
                                return (
                                    <SortableItem
                                        key={task.id}
                                        task={task}
                                        category={category}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        isDragDisabled={true}
                                    />
                                );
                            })}
                    </List>
                )}
            </Box>

            {/* 編集ダイアログ */}
            <EditDialog
                open={editDialog.open}
                task={editDialog.task}
                categories={categories}
                onClose={handleCloseDialog}
                onSave={handleSave}
                isCreate={editDialog.isCreate}
                selectedCategoryId={selectedCategoryId}
            />
        </Box>
    );
};