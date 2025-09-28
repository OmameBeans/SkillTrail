import type dayjs from "dayjs";

export const progressStatus = {
    NONE: 0,
    NOT_STARTED: 1,
    IN_PROGRESS: 2,
    COMPLETED: 3,
} as const;

export type ProgressStatus = typeof progressStatus[keyof typeof progressStatus];

export interface Progress {
    id: string;
    taskId: string;
    userId: string;
    status: ProgressStatus;
    updateDateTime: dayjs.Dayjs;
}

// 進捗クエリサービスモデル（TaskとJoinした結果）
export interface ProgressQueryServiceModel {
    id: string;
    taskId: string;
    level: number;
    taskName: string;
    userId: string;
    status: ProgressStatus;
    note: string;
}

// 進捗更新リクエスト
export interface UpdateProgressRequest {
    taskId: string;
    status: ProgressStatus;
    note: string;
}

// ユーザーID指定での進捗取得リクエスト
export interface GetProgressByUserIdRequest {
    userId: string;
}

// ID指定での進捗取得リクエスト
export interface GetProgressByIdRequest {
    id: string;
}

export type UpdateProgressResponse = {
    prevLevel: number;
    newLevel: number;
}