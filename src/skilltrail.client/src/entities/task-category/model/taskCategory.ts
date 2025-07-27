import type { Dayjs } from "dayjs";

export interface TaskCategory {
    id: string;
    categoryId: string;
    title: string;
    order: number;
    description?: string;
    updateDateTime: Dayjs;
    updateUserId: string;
}