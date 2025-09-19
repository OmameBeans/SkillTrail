import { endpoint, type GenericResult } from "../../../shared/type";
import type { Group } from '../model/group';

// ���ׂẴO���[�v���擾
export const getAllGroups = (): Promise<GenericResult<Group[]>> => {
    return fetch(`${endpoint.GROUP}/get`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })
    .then(res => res.json())
    .then(data => {
        const result: GenericResult<Group[]> = data as GenericResult<Group[]>;

        if (!result) {
            throw new Error("�O���[�v�ꗗ�̎擾�Ɏ��s���܂���");
        }

        return result;
    })
    .catch(e => {
        throw new Error(e);
    });
};

// ����̃O���[�v���擾
export const getGroup = (id: string): Promise<GenericResult<Group>> => {
    return fetch(`${endpoint.GROUP}/get?id=${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })
    .then(res => res.json())
    .then(data => {
        const result: GenericResult<Group> = data as GenericResult<Group>;

        if (!result) {
            throw new Error("�O���[�v�̎擾�Ɏ��s���܂���");
        }

        return result;
    })
    .catch(e => {
        throw new Error(e);
    });
};

// �O���[�v���쐬
export const createGroup = (group: Omit<Group, 'id' | 'updateDateTime' | 'updateUserId'>): Promise<GenericResult<void>> => {
    return fetch(`${endpoint.GROUP}/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(group),
    })
    .then(res => res.json())
    .then(data => {
        const result: GenericResult<void> = data as GenericResult<void>;

        if (!result) {
            throw new Error("�O���[�v�̍쐬�Ɏ��s���܂���");
        }

        return result;
    })
    .catch(e => {
        throw new Error(e);
    });
};

// �O���[�v���X�V
export const updateGroup = (group: Group): Promise<GenericResult<void>> => {
    return fetch(`${endpoint.GROUP}/update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(group),
    })
    .then(res => res.json())
    .then(data => {
        const result: GenericResult<void> = data as GenericResult<void>;

        if (!result) {
            throw new Error("�O���[�v�̍X�V�Ɏ��s���܂���");
        }

        return result;
    })
    .catch(e => {
        throw new Error(e);
    });
};

// �O���[�v���폜
export const deleteGroup = (id: string): Promise<GenericResult<void>> => {
    return fetch(`${endpoint.GROUP}/delete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ id }),
    })
    .then(res => res.json())
    .then(data => {
        const result: GenericResult<void> = data as GenericResult<void>;

        if (!result) {
            throw new Error("�O���[�v�̍폜�Ɏ��s���܂���");
        }

        return result;
    })
    .catch(e => {
        throw new Error(e);
    });
};