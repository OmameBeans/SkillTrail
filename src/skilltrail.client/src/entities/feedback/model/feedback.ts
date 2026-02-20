import type dayjs from "dayjs";

export interface Feedback {
    id: string;
    userId: string;
    comment: string;
    updateDateTime: dayjs.Dayjs;
    updateUserId: string;
}

export interface SubmitFeedbackRequest {
    comment: string;
}
