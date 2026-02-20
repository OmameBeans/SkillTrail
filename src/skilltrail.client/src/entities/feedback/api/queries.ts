import { useMutation } from "@tanstack/react-query";
import { submitFeedback } from "./feedback";

export const useSubmitFeedback = () => {
    return useMutation({
        mutationFn: (comment: string) => submitFeedback(comment),
    });
};
