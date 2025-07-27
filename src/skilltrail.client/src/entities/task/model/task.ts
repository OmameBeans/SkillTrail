import type { Dayjs } from "dayjs";

export interface Task {
    id: string;
    title: string;
    categoryId: string;
    description?: string;
    order: number;
    updateDateTime: Dayjs;
    updateUserId: string;
}