import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getCurrentUserProgress,
    getProgressByUserId,
    getProgressById,
    updateProgress
} from './progress';

// クエリキー
export const progressKeys = {
    all: ['progress'] as const,
    lists: () => [...progressKeys.all, 'list'] as const,
    currentUser: () => [...progressKeys.all, 'currentUser'] as const,
    byUserId: (userId: string) => [...progressKeys.all, 'userId', userId] as const,
    details: () => [...progressKeys.all, 'detail'] as const,
    detail: (id: string) => [...progressKeys.details(), id] as const,
};

// 現在ログイン中のユーザーの進捗一覧を取得
export const useCurrentUserProgress = () => {
    return useSuspenseQuery({
        queryKey: progressKeys.currentUser(),
        queryFn: () => {
            return getCurrentUserProgress()
                .then(result => {
                    if (result.hasError || !result.data) {
                        throw new Error(result.errorMessages?.join(', ') || '進捗の取得に失敗しました');
                    }
                    return result.data;
                })
                .catch(error => {
                    throw error;
                });
        },
    });
};

// 指定されたユーザーの進捗一覧を取得
export const useProgressByUserId = (userId: string) => {
    return useSuspenseQuery({
        queryKey: progressKeys.byUserId(userId),
        queryFn: () => {
            return getProgressByUserId(userId)
                .then(result => {
                    if (result.hasError || !result.data) {
                        throw new Error(result.errorMessages?.join(', ') || '進捗の取得に失敗しました');
                    }
                    return result.data;
                })
                .catch(error => {
                    throw error;
                });
        },
    });
};

// IDで進捗を取得
export const useProgressById = (id: string) => {
    return useSuspenseQuery({
        queryKey: progressKeys.detail(id),
        queryFn: () => {
            return getProgressById(id)
                .then(result => {
                    if (result.hasError || !result.data) {
                        throw new Error(result.errorMessages?.join(', ') || '進捗の取得に失敗しました');
                    }
                    return result.data;
                })
                .catch(error => {
                    throw error;
                });
        },
    });
};

// 進捗更新
export const useUpdateProgress = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ taskId, status, note }: { taskId: string; status: number, note: string }) => {
            return updateProgress(taskId, status, note)
                .then(result => {
                    if (result.hasError) {
                        throw new Error(result.errorMessages?.join(', ') || '進捗の更新に失敗しました');
                    }
                    return result;
                })
                .catch(error => {
                    throw error;
                });
        },
        onSuccess: () => {
            // 進捗関連のすべてのクエリを無効化して再取得
            queryClient.invalidateQueries({ queryKey: progressKeys.all });
        },
    });
};