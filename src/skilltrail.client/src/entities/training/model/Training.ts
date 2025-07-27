import type { Dayjs } from "dayjs";

export type Training = {
    id: string;
    title: string;
    description: string;
    order: number;
    startDate: Dayjs;
    endDate: Dayjs;
    updateDateTime: Dayjs;
    updateUserId: string;
}
