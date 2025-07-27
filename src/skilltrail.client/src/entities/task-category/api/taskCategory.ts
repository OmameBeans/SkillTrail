import { endpoint, type GenericResult, type SimpleResult } from "../../../shared/type";
import type { TaskCategory } from "../model/taskCategory";
import dayjs from 'dayjs';

export const getAllTaskCategories = (): Promise<GenericResult<TaskCategory[]>> => {
    return fetch(`${endpoint.TASK_CATEGORY}/get`).then(res => res.json()).then(data => {
        const result: GenericResult<TaskCategory[]> = data as GenericResult<TaskCategory[]>;

        if (!result) {
            throw new Error("カテゴリの取得に失敗しました");
        }

        // dayjsオブジェクトに変換
        if (result.data) {
            result.data = result.data.map(category => ({
                ...category,
                updateDateTime: dayjs(category.updateDateTime)
            }));
        }

        return result;
    }).catch(e => {
        throw new Error(e);
    });
}

export const createTaskCategory = (category: Omit<TaskCategory, 'id'>): Promise<SimpleResult> => {
    return fetch(`${endpoint.TASK_CATEGORY}/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(category)
    }).then(res => res.json()).then(data => {
        const result: SimpleResult = data as SimpleResult;

        if (!result) {
            throw new Error("カテゴリの作成に失敗しました");
        }

        return result;
    }).catch(e => {
        throw new Error(e);
    });
}

export const updateTaskCategory = (category: TaskCategory): Promise<SimpleResult> => {
    return fetch(`${endpoint.TASK_CATEGORY}/update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(category)
    }).then(res => res.json()).then(data => {
        const result: SimpleResult = data as SimpleResult;

        if (!result) {
            throw new Error("カテゴリの更新に失敗しました");
        }

        return result;
    }).catch(e => {
        throw new Error(e);
    });
}

export const deleteTaskCategory = (id: string): Promise<SimpleResult> => {
    return fetch(`${endpoint.TASK_CATEGORY}/delete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
    }).then(res => res.json()).then(data => {
        const result: SimpleResult = data as SimpleResult;

        if (!result) {
            throw new Error("カテゴリの削除に失敗しました");
        }

        return result;
    }).catch(e => {
        throw new Error(e);
    });
}

export const reorderTaskCategories = (categoryIds: string[]): Promise<SimpleResult> => {
    return fetch(`${endpoint.TASK_CATEGORY}/reorder`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categoryIds })
    }).then(res => res.json()).then(data => {
        const result: SimpleResult = data as SimpleResult;

        if (!result) {
            throw new Error("カテゴリの並び順変更に失敗しました");
        }

        return result;
    }).catch(e => {
        throw new Error(e);
    });
}