import type { Dayjs } from "dayjs";

export type Phase = {
    id: string;
    name: string;
    trainingId: string;
    description: string;
    order: number;
    startDate: Dayjs;
    endDate: Dayjs;
    updateDateTime: Dayjs;
    updateUserId: string;
}