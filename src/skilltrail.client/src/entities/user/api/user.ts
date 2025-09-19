import { endpoint, type GenericResult } from "../../../shared/type";
import type { User } from '../model/user';

// 現在のユーザーを取得
export const getCurrentUser = (): Promise<GenericResult<User>> => {
    return fetch(`${endpoint.USER}/getCurrentUser`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // クッキーを含める（認証が必要な場合）
    })
        .then(res => res.json())
        .then(data => {
            const result: GenericResult<User> = data as GenericResult<User>;

            if (!result) {
                throw new Error("現在のユーザーの取得に失敗しました");
            }

            return result;
        })
        .catch(e => {
            throw new Error(e);
        });
};

// すべてのユーザーを取得
export const getAllUsers = (): Promise<GenericResult<User[]>> => {
    return fetch(`${endpoint.USER}/get`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })
        .then(res => res.json())
        .then(data => {
            const result: GenericResult<User[]> = data as GenericResult<User[]>;

            if (!result) {
                throw new Error("ユーザー一覧の取得に失敗しました");
            }

            return result;
        })
        .catch(e => {
            throw new Error(e);
        });
};

// ユーザーを作成
export const createUser = (user: User): Promise<GenericResult<User>> => {
    return fetch(`${endpoint.USER}/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(user),
    })
        .then(res => res.json())
        .then(data => {
            const result: GenericResult<User> = data as GenericResult<User>;

            if (!result) {
                throw new Error("ユーザーの作成に失敗しました");
            }

            return result;
        })
        .catch(e => {
            throw new Error(e);
        });
};

// ユーザーを更新
export const updateUser = (user: User): Promise<GenericResult<User>> => {
    return fetch(`${endpoint.USER}/update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(user),
    })
        .then(res => res.json())
        .then(data => {
            const result: GenericResult<User> = data as GenericResult<User>;

            if (!result) {
                throw new Error("ユーザーの更新に失敗しました");
            }

            return result;
        })
        .catch(e => {
            throw new Error(e);
        });
};

// ユーザーを削除
export const deleteUser = (id: string): Promise<GenericResult<boolean>> => {
    return fetch(`${endpoint.USER}/delete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ id }),
    })
        .then(res => res.json())
        .then(data => {
            const result: GenericResult<boolean> = data as GenericResult<boolean>;

            if (!result) {
                throw new Error("ユーザーの削除に失敗しました");
            }

            return result;
        })
        .catch(e => {
            throw new Error(e);
        });
};

// CSVファイルでユーザーを一括インポート
export const importUsersFromCsv = (file: File): Promise<GenericResult<{ imported: number; failed: number }>> => {
    const formData = new FormData();
    formData.append('file', file);

    return fetch(`${endpoint.USER}/import`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
    })
        .then(res => res.json())
        .then(data => {
            const result: GenericResult<{ imported: number; failed: number }> = data as GenericResult<{ imported: number; failed: number }>;

            if (!result) {
                throw new Error("CSVインポートに失敗しました");
            }

            return result;
        })
        .catch(e => {
            throw new Error(e);
        });
};
