import { useQuery } from '@tanstack/react-query';
import { getLevels, getCurrentUserLevel } from './level';

// クエリキー
export const levelKeys = {
    all: ['levels'] as const,
    list: () => [...levelKeys.all, 'list'] as const,
    currentUser: () => [...levelKeys.all, 'currentUser'] as const,
} as const;

// レベル一覧取得
export const useLevels = () => {
    return useQuery({
        queryKey: levelKeys.list(),
        queryFn: () => {
            return getLevels()
                .then(result => {
                    if (result.hasError || !result.data) {
                        throw new Error(result.errorMessages?.join(', ') || 'レベル情報の取得に失敗しました');
                    }
                    return result.data;
                });
        },
        staleTime: 5 * 60 * 1000, // 5分間キャッシュ
    });
};

// 現在のユーザーレベル取得
export const useCurrentUserLevel = () => {
    return useQuery({
        queryKey: levelKeys.currentUser(),
        queryFn: () => {
            return getCurrentUserLevel()
                .then(result => {
                    if (result.hasError || !result.data) {
                        throw new Error(result.errorMessages?.join(', ') || '現在のレベル情報の取得に失敗しました');
                    }
                    return result.data;
                });
        },
    });
};
