import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    getAllTaskCategories, 
    createTaskCategory, 
    updateTaskCategory, 
    deleteTaskCategory, 
    reorderTaskCategories 
} from './taskCategory';
import type { TaskCategory } from '../model/taskCategory';

// クエリキー
export const taskCategoryKeys = {
    all: ['taskCategories'] as const,
    lists: () => [...taskCategoryKeys.all, 'list'] as const,
    list: (filters: string) => [...taskCategoryKeys.lists(), { filters }] as const,
    details: () => [...taskCategoryKeys.all, 'detail'] as const,
    detail: (id: string) => [...taskCategoryKeys.details(), id] as const,
};

// タスクカテゴリ一覧取得
export const useTaskCategories = () => {
    return useSuspenseQuery({
        queryKey: taskCategoryKeys.lists(),
        queryFn: () => {
            return getAllTaskCategories()
                .then(result => {
                    if (result.hasError || !result.data) {
                        throw new Error(result.errorMessages?.join(', ') || 'タスクカテゴリの取得に失敗しました');
                    }
                    return result.data;
                })
                .catch(error => {
                    throw error;
                });
        },
    });
};

// タスクカテゴリ作成
export const useCreateTaskCategory = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (category: Omit<TaskCategory, 'id'>) => {
            return createTaskCategory(category)
                .then(result => {
                    if (result.hasError) {
                        throw new Error(result.errorMessages?.join(', ') || 'タスクカテゴリの作成に失敗しました');
                    }
                    return result;
                })
                .catch(error => {
                    throw error;
                });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: taskCategoryKeys.lists() });
        },
    });
};

// タスクカテゴリ更新
export const useUpdateTaskCategory = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (category: TaskCategory) => {
            return updateTaskCategory(category)
                .then(result => {
                    if (result.hasError) {
                        throw new Error(result.errorMessages?.join(', ') || 'タスクカテゴリの更新に失敗しました');
                    }
                    return result;
                })
                .catch(error => {
                    throw error;
                });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: taskCategoryKeys.lists() });
        },
    });
};

// タスクカテゴリ削除
export const useDeleteTaskCategory = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (id: string) => {
            return deleteTaskCategory(id)
                .then(result => {
                    if (result.hasError) {
                        throw new Error(result.errorMessages?.join(', ') || 'タスクカテゴリの削除に失敗しました');
                    }
                    return result;
                })
                .catch(error => {
                    throw error;
                });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: taskCategoryKeys.lists() });
        },
    });
};

// タスクカテゴリ順序変更
export const useReorderTaskCategories = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (categoryIds: string[]) => {
            return reorderTaskCategories(categoryIds)
                .then(result => {
                    if (result.hasError) {
                        throw new Error(result.errorMessages?.join(', ') || 'タスクカテゴリの並び順変更に失敗しました');
                    }
                    return result;
                })
                .catch(error => {
                    throw error;
                });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: taskCategoryKeys.lists() });
        },
    });
};
