import { endpoint, type SimpleResult } from "../../../shared/type";
import type { SubmitFeedbackRequest } from "../model/feedback";

export const submitFeedback = async (comment: string): Promise<SimpleResult> => {
    try {
        const response = await fetch(`${endpoint.FEEDBACK}/submitFeedback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ comment } as SubmitFeedbackRequest)
        });

        if (!response.ok) {
            throw new Error("フィードバックの送信に失敗しました");
        }

        const result: SimpleResult = await response.json();
        return result;
    } catch (error) {
        console.error('Feedback submission error:', error);
        throw error;
    }
};
