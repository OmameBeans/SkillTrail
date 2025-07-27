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