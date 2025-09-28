import type { Dayjs } from "dayjs";

export interface Task {
    id: string;
    title: string;
    categoryId: string;
    description?: string;
    order: number;
    level: number;
    updateDateTime: Dayjs;
    updateUserId: string;
}