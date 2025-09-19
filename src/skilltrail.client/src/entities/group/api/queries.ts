import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    getAllGroups, 
    getGroup,
    createGroup, 
    updateGroup, 
    deleteGroup 
} from './group';
import type { Group } from '../model/group';

// �N�G���L�[
export const groupKeys = {
    all: ['groups'] as const,
    lists: () => [...groupKeys.all, 'list'] as const,
    list: (filters: string) => [...groupKeys.lists(), { filters }] as const,
    details: () => [...groupKeys.all, 'detail'] as const,
    detail: (id: string) => [...groupKeys.details(), id] as const,
};

// �O���[�v�ꗗ�擾
export const useGroups = () => {
    return useSuspenseQuery({
        queryKey: groupKeys.lists(),
        queryFn: () => {
            return getAllGroups()
                .then(result => {
                    if (result.hasError || !result.data) {
                        throw new Error(result.errorMessages?.join(', ') || '�O���[�v�̎擾�Ɏ��s���܂���');
                    }
                    return result.data;
                })
                .catch(error => {
                    throw error;
                });
        },
    });
};

// ����̃O���[�v�擾
export const useGroup = (id: string) => {
    return useSuspenseQuery({
        queryKey: groupKeys.detail(id),
        queryFn: () => {
            return getGroup(id)
                .then(result => {
                    if (result.hasError || !result.data) {
                        throw new Error(result.errorMessages?.join(', ') || '�O���[�v�̎擾�Ɏ��s���܂���');
                    }
                    return result.data;
                })
                .catch(error => {
                    throw error;
                });
        },
    });
};

// �O���[�v�쐬
export const useCreateGroup = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (group: Omit<Group, 'id' | 'updateDateTime' | 'updateUserId'>) => {
            return createGroup(group)
                .then(result => {
                    if (result.hasError) {
                        throw new Error(result.errorMessages?.join(', ') || '�O���[�v�̍쐬�Ɏ��s���܂���');
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

// �O���[�v�X�V
export const useUpdateGroup = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (group: Group) => {
            return updateGroup(group)
                .then(result => {
                    if (result.hasError) {
                        throw new Error(result.errorMessages?.join(', ') || '�O���[�v�̍X�V�Ɏ��s���܂���');
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

// �O���[�v�폜
export const useDeleteGroup = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (id: string) => {
            return deleteGroup(id)
                .then(result => {
                    if (result.hasError) {
                        throw new Error(result.errorMessages?.join(', ') || '�O���[�v�̍폜�Ɏ��s���܂���');
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