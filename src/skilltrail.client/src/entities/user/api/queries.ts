import { useSuspenseQuery } from '@tanstack/react-query';
import { getCurrentUser } from './user';

// クエリキー
export const userKeys = {
    all: ['users'] as const,
    current: () => [...userKeys.all, 'current'] as const,
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