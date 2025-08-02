import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCurrentUser, getAllUsers, createUser, updateUser, deleteUser, importUsersFromCsv } from './user';

// クエリキー
export const userKeys = {
    all: ['users'] as const,
    current: () => [...userKeys.all, 'current'] as const,
    list: () => [...userKeys.all, 'list'] as const,
} as const;

// 現在のユーザー取得
export const useCurrentUser = () => {
    return useSuspenseQuery({
        queryKey: userKeys.current(),
        queryFn: () => {
            return getCurrentUser()
                .then(result => {
                    if (result.hasError || !result.data) {
                        throw new Error(result.errorMessages?.join(', ') || '現在のユーザーの取得に失敗しました');
                    }
                    return result.data;
                })
                .catch(error => {
                    throw error;
                });
        },
        staleTime: 5 * 60 * 1000, // 5分間キャッシュを有効とする
        gcTime: 10 * 60 * 1000, // 10分間メモリに保持
    });
};

// ユーザー一覧取得
export const useUsers = () => {
    return useSuspenseQuery({
        queryKey: userKeys.list(),
        queryFn: () => {
            return getAllUsers()
                .then(result => {
                    if (result.hasError || !result.data) {
                        throw new Error(result.errorMessages?.join(', ') || 'ユーザー一覧の取得に失敗しました');
                    }
                    return result.data;
                })
                .catch(error => {
                    throw error;
                });
        },
        staleTime: 1 * 60 * 1000, // 1分間キャッシュを有効とする
        gcTime: 5 * 60 * 1000, // 5分間メモリに保持
    });
};

// ユーザー作成ミューテーション
export const useCreateUser = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.list() });
        },
    });
};

// ユーザー更新ミューテーション
export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: updateUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.list() });
        },
    });
};

// ユーザー削除ミューテーション
export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.list() });
        },
    });
};

// CSVインポートミューテーション
export const useImportUsersFromCsv = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: importUsersFromCsv,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.list() });
        },
    });
};