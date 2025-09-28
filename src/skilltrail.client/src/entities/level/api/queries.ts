import { useQuery } from '@tanstack/react-query';
import { getLevels } from './level';

// クエリキー
export const levelKeys = {
    all: ['levels'] as const,
    list: () => [...levelKeys.all, 'list'] as const,
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
