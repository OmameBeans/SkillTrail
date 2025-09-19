import { endpoint, type GenericResult } from "../../../shared/type";
import type { Group } from '../model/group';

// すべてのグループを取得
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
            throw new Error("グループ一覧の取得に失敗しました");
        }

        return result;
    })
    .catch(e => {
        throw new Error(e);
    });
};

// 特定のグループを取得
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
            throw new Error("グループの取得に失敗しました");
        }

        return result;
    })
    .catch(e => {
        throw new Error(e);
    });
};

// グループを作成
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
            throw new Error("グループの作成に失敗しました");
        }

        return result;
    })
    .catch(e => {
        throw new Error(e);
    });
};

// グループを更新
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
            throw new Error("グループの更新に失敗しました");
        }

        return result;
    })
    .catch(e => {
        throw new Error(e);
    });
};

// グループを削除
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
            throw new Error("グループの削除に失敗しました");
        }

        return result;
    })
    .catch(e => {
        throw new Error(e);
    });
};