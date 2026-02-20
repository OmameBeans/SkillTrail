import { Box } from "@mui/material";
import { FeedbackForm } from "../../../features/feedback-form";

export const FeedbackPage = () => {
    return (
        <Box sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            pt: 4,
        }}>
            <FeedbackForm />
        </Box>
    );
}