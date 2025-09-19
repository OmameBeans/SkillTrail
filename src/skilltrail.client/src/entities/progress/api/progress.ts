import { endpoint, type GenericResult, type SimpleResult } from "../../../shared/type";
import type {
    Progress,
    ProgressQueryServiceModel,
    UpdateProgressRequest,
    GetProgressByUserIdRequest,
    GetProgressByIdRequest
} from '../model/progress';
import dayjs from 'dayjs';

// 現在ログイン中のユーザーの進捗一覧を取得
export const getCurrentUserProgress = (): Promise<GenericResult<ProgressQueryServiceModel[]>> => {
    return fetch(`${endpoint.PROGRESS}/get`).then(res => res.json()).then(data => {
        const result: GenericResult<ProgressQueryServiceModel[]> = data as GenericResult<ProgressQueryServiceModel[]>;

        if (!result) {
            throw new Error("進捗の取得に失敗しました");
        }

        return result;
    }).catch(e => {
        throw new Error(e);
    });
};

// 指定されたユーザーの進捗一覧を取得
export const getProgressByUserId = (userId: string): Promise<GenericResult<ProgressQueryServiceModel[]>> => {
    return fetch(`${endpoint.PROGRESS}/getByUserId`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId } as GetProgressByUserIdRequest)
    }).then(res => res.json()).then(data => {
        const result: GenericResult<ProgressQueryServiceModel[]> = data as GenericResult<ProgressQueryServiceModel[]>;

        if (!result) {
            throw new Error("進捗の取得に失敗しました");
        }

        return result;
    }).catch(e => {
        throw new Error(e);
    });
};

// IDで進捗を取得
export const getProgressById = (id: string): Promise<GenericResult<Progress>> => {
    return fetch(`${endpoint.PROGRESS}/getById`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id } as GetProgressByIdRequest)
    }).then(res => res.json()).then(data => {
        const result: GenericResult<Progress> = data as GenericResult<Progress>;

        if (!result) {
            throw new Error("進捗の取得に失敗しました");
        }

        // dayjsオブジェクトに変換
        if (result.data) {
            result.data = {
                ...result.data,
                updateDateTime: dayjs(result.data.updateDateTime)
            };
        }

        return result;
    }).catch(e => {
        throw new Error(e);
    });
};

// 進捗を更新
export const updateProgress = (taskId: string, status: number, note: string): Promise<SimpleResult> => {
    return fetch(`${endpoint.PROGRESS}/update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId, status, note } as UpdateProgressRequest)
    }).then(res => res.json()).then(data => {
        const result: SimpleResult = data as SimpleResult;

        if (!result) {
            throw new Error("進捗の更新に失敗しました");
        }

        return result;
    }).catch(e => {
        throw new Error(e);
    });
};