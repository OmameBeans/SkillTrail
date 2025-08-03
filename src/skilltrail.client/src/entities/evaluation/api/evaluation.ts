import type { GenericResult } from '../../../shared/type/result';
import { endpoint } from '../../../shared/type/endpoint';
import type { Evaluation } from '../model/evaluation';

// 特定ユーザーの評価一覧取得
export const getEvaluationsByUserId = (userId: string): Promise<GenericResult<Evaluation[]>> => {
    return fetch(`${endpoint.EVALUATION}/getByUserId/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })
    .then(res => res.json())
    .then(data => {
        const result: GenericResult<Evaluation[]> = data as GenericResult<Evaluation[]>;

        if (!result) {
            throw new Error("評価の取得に失敗しました");
        }

        return result;
    })
    .catch(e => {
        throw new Error(e);
    });
};

// 評価作成
export const createEvaluation = (evaluation: Omit<Evaluation, 'id'>): Promise<GenericResult<Evaluation>> => {
    return fetch(`${endpoint.EVALUATION}/Create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(evaluation),
    })
    .then(res => res.json())
    .then(data => {
        const result: GenericResult<Evaluation> = data as GenericResult<Evaluation>;

        if (!result) {
            throw new Error("評価の作成に失敗しました");
        }

        return result;
    })
    .catch(e => {
        throw new Error(e);
    });
};

// 評価更新
export const updateEvaluation = (evaluation: Evaluation): Promise<GenericResult<Evaluation>> => {
    return fetch(`${endpoint.EVALUATION}/update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(evaluation),
    })
    .then(res => res.json())
    .then(data => {
        const result: GenericResult<Evaluation> = data as GenericResult<Evaluation>;

        if (!result) {
            throw new Error("評価の更新に失敗しました");
        }

        return result;
    })
    .catch(e => {
        throw new Error(e);
    });
};

// 評価削除
export const deleteEvaluation = (id: string): Promise<GenericResult<void>> => {
    return fetch(`${endpoint.EVALUATION}/delete`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
    })
    .then(res => res.json())
    .then(data => {
        const result: GenericResult<void> = data as GenericResult<void>;

        if (!result) {
            throw new Error("評価の削除に失敗しました");
        }

        return result;
    })
    .catch(e => {
        throw new Error(e);
    });
};
