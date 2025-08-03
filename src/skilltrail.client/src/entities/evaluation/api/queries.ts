import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEvaluationsByUserId, createEvaluation, updateEvaluation, deleteEvaluation } from './evaluation';

// クエリキー
export const evaluationKeys = {
    all: ['evaluations'] as const,
    byUserId: (userId: string) => [...evaluationKeys.all, 'user', userId] as const,
} as const;

// 特定ユーザーの評価一覧取得
export const useEvaluationsByUserId = (userId: string) => {
    return useSuspenseQuery({
        queryKey: evaluationKeys.byUserId(userId),
        queryFn: () => {
            return getEvaluationsByUserId(userId)
                .then(result => {
                    if (result.hasError || !result.data) {
                        throw new Error(result.errorMessages?.join(', ') || '評価の取得に失敗しました');
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

// 評価作成ミューテーション
export const useCreateEvaluation = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: createEvaluation,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: evaluationKeys.byUserId(variables.userId) });
        },
    });
};

// 評価更新ミューテーション
export const useUpdateEvaluation = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: updateEvaluation,
        onSuccess: (data) => {
            if (data.data) {
                queryClient.invalidateQueries({ queryKey: evaluationKeys.byUserId(data.data.userId) });
            }
        },
    });
};

// 評価削除ミューテーション
export const useDeleteEvaluation = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: deleteEvaluation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: evaluationKeys.all });
        },
    });
};
