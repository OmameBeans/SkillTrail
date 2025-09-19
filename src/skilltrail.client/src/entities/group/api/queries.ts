import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    getAllGroups, 
    getGroup,
    createGroup, 
    updateGroup, 
    deleteGroup 
} from './group';
import type { Group } from '../model/group';

// クエリキー
export const groupKeys = {
    all: ['groups'] as const,
    lists: () => [...groupKeys.all, 'list'] as const,
    list: (filters: string) => [...groupKeys.lists(), { filters }] as const,
    details: () => [...groupKeys.all, 'detail'] as const,
    detail: (id: string) => [...groupKeys.details(), id] as const,
};

// グループ一覧取得
export const useGroups = () => {
    return useSuspenseQuery({
        queryKey: groupKeys.lists(),
        queryFn: () => {
            return getAllGroups()
                .then(result => {
                    if (result.hasError || !result.data) {
                        throw new Error(result.errorMessages?.join(', ') || 'グループの取得に失敗しました');
                    }
                    return result.data;
                })
                .catch(error => {
                    throw error;
                });
        },
    });
};

// 特定のグループ取得
export const useGroup = (id: string) => {
    return useSuspenseQuery({
        queryKey: groupKeys.detail(id),
        queryFn: () => {
            return getGroup(id)
                .then(result => {
                    if (result.hasError || !result.data) {
                        throw new Error(result.errorMessages?.join(', ') || 'グループの取得に失敗しました');
                    }
                    return result.data;
                })
                .catch(error => {
                    throw error;
                });
        },
    });
};

// グループ作成
export const useCreateGroup = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (group: Omit<Group, 'id' | 'updateDateTime' | 'updateUserId'>) => {
            return createGroup(group)
                .then(result => {
                    if (result.hasError) {
                        throw new Error(result.errorMessages?.join(', ') || 'グループの作成に失敗しました');
                    }
                    return result;
                })
                .catch(error => {
                    throw error;
                });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
        },
    });
};

// グループ更新
export const useUpdateGroup = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (group: Group) => {
            return updateGroup(group)
                .then(result => {
                    if (result.hasError) {
                        throw new Error(result.errorMessages?.join(', ') || 'グループの更新に失敗しました');
                    }
                    return result;
                })
                .catch(error => {
                    throw error;
                });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
        },
    });
};

// グループ削除
export const useDeleteGroup = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (id: string) => {
            return deleteGroup(id)
                .then(result => {
                    if (result.hasError) {
                        throw new Error(result.errorMessages?.join(', ') || 'グループの削除に失敗しました');
                    }
                    return result;
                })
                .catch(error => {
                    throw error;
                });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
        },
    });
};