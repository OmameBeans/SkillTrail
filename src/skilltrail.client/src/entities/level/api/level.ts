import { endpoint, type GenericResult } from '../../../shared/type';
import type { Level, UserLevel } from '../model/level';

// レベル一覧を取得
export const getLevels = (): Promise<GenericResult<Level[]>> => {
    return fetch(`${endpoint.LEVEL}/get`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })
        .then(res => res.json())
        .then(data => {
            const result: GenericResult<Level[]> = data as GenericResult<Level[]>;

            if (!result) {
                throw new Error('レベル情報の取得に失敗しました');
            }

            return result;
        })
        .catch(error => {
            console.error('Level API error:', error);
            throw error;
        });
};

// 現在のユーザーレベルを取得
export const getCurrentUserLevel = (): Promise<GenericResult<UserLevel>> => {
    return fetch(`${endpoint.LEVEL}/getCurrentUserLevel`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })
        .then(res => res.json())
        .then(data => {
            const result: GenericResult<UserLevel> = data as GenericResult<UserLevel>;

            if (!result) {
                throw new Error('現在のレベル情報の取得に失敗しました');
            }

            return result;
        })
        .catch(error => {
            console.error('Current User Level API error:', error);
            throw error;
        });
};
