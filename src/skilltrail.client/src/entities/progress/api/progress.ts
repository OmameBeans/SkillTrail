import { endpoint, type GenericResult } from "../../../shared/type";
import type {
    Progress,
    ProgressQueryServiceModel,
    UpdateProgressRequest,
    GetProgressByUserIdRequest,
    GetProgressByIdRequest,
    UpdateProgressResponse,
    ExportTraineeProgressRequest,
} from '../model/progress';
import dayjs from 'dayjs';

// 現在ログイン中のユーザーの進捗一覧を取得
export const getCurrentUserProgress = (categoryId?: string): Promise<GenericResult<ProgressQueryServiceModel[]>> => {
    const query = categoryId ? `?cid=${encodeURIComponent(categoryId)}` : '';

    return fetch(`${endpoint.PROGRESS}/get${query}`).then(res => res.json()).then(data => {
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
export const getProgressByUserId = (userId: string, categoryId?: string): Promise<GenericResult<ProgressQueryServiceModel[]>> => {
    return fetch(`${endpoint.PROGRESS}/getByUserId`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, categoryId } as GetProgressByUserIdRequest)
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
export const updateProgress = (taskId: string, status: number, note: string): Promise<GenericResult<UpdateProgressResponse>> => {
    return fetch(`${endpoint.PROGRESS}/update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId, status, note } as UpdateProgressRequest)
    }).then(res => res.json()).then(data => {
        const result: GenericResult<UpdateProgressResponse> = data as GenericResult<UpdateProgressResponse>;

        if (!result) {
            throw new Error("進捗の更新に失敗しました");
        }

        return result;
    }).catch(e => {
        throw new Error(e);
    });
};

type ExportTraineeProgressParams = ExportTraineeProgressRequest & {
    groupName: string;
    categoryName: string;
};

const sanitizeFileNameSegment = (segment: string) => {
    const invalidChars = /[\\/:*?"<>|]/g;
    const trimmed = segment.trim();
    const sanitized = trimmed.replace(invalidChars, '_');
    return sanitized.length > 0 ? sanitized : '未設定';
};

export const exportTraineeProgress = ({ groupId, groupName, categoryId, categoryName }: ExportTraineeProgressParams): Promise<void> => {
    const normalizedGroupId = groupId.trim();
    const normalizedCategoryId = categoryId && categoryId.trim() ? categoryId.trim() : undefined;
    const safeGroupName = sanitizeFileNameSegment(groupName || '全ての新人');
    const safeCategoryName = sanitizeFileNameSegment(categoryName || 'すべてのカテゴリ');

    return fetch(`${endpoint.PROGRESS}/ExportTraineeProgress`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            groupId: normalizedGroupId,
            categoryId: normalizedCategoryId,
        }),
    })
        .then(async (response) => {
            if (!response.ok) {
                // エラーレスポンスの場合はJSONを取得してエラーメッセージを表示
                const errorData = await response.json();
                throw new Error(errorData.message || 'エクスポートに失敗しました');
            }

            // Blobオブジェクトとしてレスポンスを取得
            const blob = await response.blob();
            
            const nowDate = dayjs();
            const dateString = nowDate.format('YYYYMMDDHHmmss');
            const filenameSegments = ['進捗一覧', safeGroupName, safeCategoryName];
            const filename = `${filenameSegments.join('_')}_${dateString}.xlsx`;

            // ダウンロードリンクを作成してクリック
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            
            // クリーンアップ
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            throw new Error(error.message || 'エクスポート中にエラーが発生しました');
        });
};