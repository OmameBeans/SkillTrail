import { Box, Button, TextField } from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useSubmitFeedback } from "../../../entities/feedback";

export const FeedbackForm = () => {
    const [value, setValue] = useState<string>('');
    const { enqueueSnackbar } = useSnackbar();
    const submitFeedbackMutation = useSubmitFeedback();

    const handleSubmit = async () => {
        if (!value.trim()) {
            enqueueSnackbar('フィードバックを入力してください', { variant: 'warning' });
            return;
        }

        if (!confirm('送信してよろしいでしょうか？')) {
            return;
        }

        try {
            const result = await submitFeedbackMutation.mutateAsync(value);
            
            if (!result.hasError) {
                enqueueSnackbar('フィードバックが送信されました', { variant: 'success' });
                setValue(''); // 送信成功後にフォームをクリア
            } else {
                enqueueSnackbar(
                    result.errorMessages.join(', ') || 'フィードバックの送信に失敗しました',
                    { variant: 'error' }
                );
            }
        } catch (error) {
            enqueueSnackbar('フィードバックの送信中にエラーが発生しました', { variant: 'error' });
            console.error('Feedback submission error:', error);
        }
    };

    return (<Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        minWidth: "500px",
    }}>
        <Box>
        </Box>
        <Box>
            <TextField
                fullWidth
                label="フィードバックを入力してください"
                multiline
                minRows={10}
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
        </Box>
        <Box sx={{
            display: 'flex',
            justifyContent: 'end',
            gap: 1,
        }}>
            <Button
                variant='contained'
                onClick={handleSubmit}
                disabled={submitFeedbackMutation.isPending || !value.trim()}
            >
                {submitFeedbackMutation.isPending ? '送信中...' : '送信'}
            </Button>
        </Box>
    </Box>);
}