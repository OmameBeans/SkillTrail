import { endpoint, type GenericResult, type SimpleResult } from "../../../shared/type";
import type { Task } from '../model/task';
import dayjs from 'dayjs';

// タスク一覧取得（カテゴリ別）
export const getTasksByCategory = (categoryId: string): Promise<GenericResult<Task[]>> => {
    return fetch(`${endpoint.TASK}/getByCategory`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categoryId })
    }).then(res => res.json()).then(data => {
        const result: GenericResult<Task[]> = data as GenericResult<Task[]>;

        if (!result) {
            throw new Error("タスクの取得に失敗しました");
        }

        // dayjsオブジェクトに変換
        if (result.data) {
            result.data = result.data.map(task => ({
                ...task,
                updateDateTime: dayjs(task.updateDateTime)
            }));
        }

        return result;
    }).catch(e => {
        throw new Error(e);
    });
};

// 全タスク取得
export const getAllTasks = (): Promise<GenericResult<Task[]>> => {
    return fetch(`${endpoint.TASK}/get`).then(res => res.json()).then(data => {
        const result: GenericResult<Task[]> = data as GenericResult<Task[]>;

        if (!result) {
            throw new Error("タスクの取得に失敗しました");
        }

        // dayjsオブジェクトに変換
        if (result.data) {
            result.data = result.data.map(task => ({
                ...task,
                updateDateTime: dayjs(task.updateDateTime)
            }));
        }

        return result;
    }).catch(e => {
        throw new Error(e);
    });
};

// タスク作成
export const createTask = (task: Omit<Task, 'id'>): Promise<SimpleResult> => {
    return fetch(`${endpoint.TASK}/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(task)
    }).then(res => res.json()).then(data => {
        const result: SimpleResult = data as SimpleResult;

        if (!result) {
            throw new Error("タスクの作成に失敗しました");
        }

        return result;
    }).catch(e => {
        throw new Error(e);
    });
};

// タスク更新
export const updateTask = (task: Task): Promise<SimpleResult> => {
    return fetch(`${endpoint.TASK}/update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(task)
    }).then(res => res.json()).then(data => {
        const result: SimpleResult = data as SimpleResult;

        if (!result) {
            throw new Error("タスクの更新に失敗しました");
        }

        return result;
    }).catch(e => {
        throw new Error(e);
    });
};

// タスク削除
export const deleteTask = (id: string): Promise<SimpleResult> => {
    return fetch(`${endpoint.TASK}/delete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
    }).then(res => res.json()).then(data => {
        const result: SimpleResult = data as SimpleResult;

        if (!result) {
            throw new Error("タスクの削除に失敗しました");
        }

        return result;
    }).catch(e => {
        throw new Error(e);
    });
};

// タスク並び順変更
export const reorderTasks = (categoryId: string, taskIds: string[]): Promise<SimpleResult> => {
    return fetch(`${endpoint.TASK}/reorder`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categoryId, taskIds })
    }).then(res => res.json()).then(data => {
        const result: SimpleResult = data as SimpleResult;

        if (!result) {
            throw new Error("タスクの並び順変更に失敗しました");
        }

        return result;
    }).catch(e => {
        throw new Error(e);
    });
};
