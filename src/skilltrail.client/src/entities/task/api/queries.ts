import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getAllTasks,
    getTasksByCategory,
    createTask,
    updateTask,
    deleteTask,
    reorderTasks
} from './task';
import type { Task } from '../model/task';

// クエリキー
export const taskKeys = {
    all: ['tasks'] as const,
    lists: () => [...taskKeys.all, 'list'] as const,
    list: (filters: string) => [...taskKeys.lists(), { filters }] as const,
    byCategory: (categoryId: string) => [...taskKeys.all, 'category', categoryId] as const,
    details: () => [...taskKeys.all, 'detail'] as const,
    detail: (id: string) => [...taskKeys.details(), id] as const,
};

// 全タスク取得
export const useTasks = (categoryId?: string) => {
    return useSuspenseQuery({
        queryKey: taskKeys.byCategory(categoryId || ''),
        queryFn: () => {
            if (!categoryId) {
                return getAllTasks()
                    .then(result => {
                        if (result.hasError || !result.data) {
                            throw new Error(result.errorMessages?.join(', ') || 'タスクの取得に失敗しました');
                        }
                        return result.data;
                    })
                    .catch(error => {
                        throw error;
                    });
            } else {
                return getTasksByCategory(categoryId)
                    .then(result => {
                        if (result.hasError || !result.data) {
                            throw new Error(result.errorMessages?.join(', ') || 'カテゴリ別タスクの取得に失敗しました');
                        }
                        return result.data;
                    })
                    .catch(error => {
                        throw error;
                    });
            }
        },
    });
};

// カテゴリ別タスク取得
export const useTasksByCategory = (categoryId: string) => {
    return useSuspenseQuery({
        queryKey: taskKeys.byCategory(categoryId),
        queryFn: () => {
            return getTasksByCategory(categoryId)
                .then(result => {
                    if (result.hasError || !result.data) {
                        throw new Error(result.errorMessages?.join(', ') || 'タスクの取得に失敗しました');
                    }
                    return result.data;
                })
                .catch(error => {
                    throw error;
                });
        },
    });
};

// タスク作成
export const useCreateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (task: Omit<Task, 'id'>) => {
            return createTask(task)
                .then(result => {
                    if (result.hasError) {
                        throw new Error(result.errorMessages?.join(', ') || 'タスクの作成に失敗しました');
                    }
                    return result;
                })
                .catch(error => {
                    throw error;
                });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
            queryClient.invalidateQueries({ queryKey: taskKeys.all });
        },
    });
};

// タスク更新
export const useUpdateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (task: Task) => {
            return updateTask(task)
                .then(result => {
                    if (result.hasError) {
                        throw new Error(result.errorMessages?.join(', ') || 'タスクの更新に失敗しました');
                    }
                    return result;
                })
                .catch(error => {
                    throw error;
                });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
            queryClient.invalidateQueries({ queryKey: taskKeys.all });
        },
    });
};

// タスク削除
export const useDeleteTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => {
            return deleteTask(id)
                .then(result => {
                    if (result.hasError) {
                        throw new Error(result.errorMessages?.join(', ') || 'タスクの削除に失敗しました');
                    }
                    return result;
                })
                .catch(error => {
                    throw error;
                });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
            queryClient.invalidateQueries({ queryKey: taskKeys.all });
        },
    });
};

// タスク並び順変更
export const useReorderTasks = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ categoryId, taskIds }: { categoryId: string; taskIds: string[] }) => {
            return reorderTasks(categoryId, taskIds)
                .then(result => {
                    if (result.hasError) {
                        throw new Error(result.errorMessages?.join(', ') || 'タスクの並び順変更に失敗しました');
                    }
                    return result;
                })
                .catch(error => {
                    throw error;
                });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
            queryClient.invalidateQueries({ queryKey: taskKeys.all });
        },
    });
};
