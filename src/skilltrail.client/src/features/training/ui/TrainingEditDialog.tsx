import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    CircularProgress
} from "@mui/material";
import { useState, useEffect, Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { EditMode } from "../../../shared/type";
import { editMode } from "../../../shared/type";
import type { Training } from "../../../entities/training";
import dayjs from "dayjs";

type Props = {
    trainingId: string;
    mode: EditMode;
    open: boolean;
    onClose: () => void;
}

// モックAPI関数
const fetchTraining = async (id: string): Promise<Training> => {
    // 実際のAPIコールに置き換える
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id,
                title: `研修タイトル ${id}`,
                description: `研修の説明 ${id}`,
                order: parseInt(id),
                startDate: dayjs('2025-02-01'),
                endDate: dayjs('2025-02-05'),
                updateDateTime: dayjs(),
                updateUserId: 'current-user'
            });
        }, 500);
    });
};

// フォームコンポーネント（Suspense内で使用）
const TrainingEditForm = ({ trainingId, mode, onClose }: {
    trainingId: string;
    mode: EditMode;
    onClose: () => void;
}) => {
    const [formData, setFormData] = useState<Partial<Training>>({
        title: '',
        description: '',
        order: 0,
        startDate: undefined,
        endDate: undefined,
    });

    // 編集モードの場合のみuseSuspenseQueryを使用
    const training = mode === editMode.UPDATE ?
        useSuspenseQuery({
            queryKey: ['training', trainingId],
            queryFn: () => fetchTraining(trainingId),
        }).data : null;

    // 編集モードでデータを取得した際にフォームに設定
    useEffect(() => {
        if (mode === editMode.UPDATE && training) {
            setFormData({
                title: training.title,
                description: training.description,
                order: training.order,
                startDate: training.startDate,
                endDate: training.endDate,
            });
        } else if (mode === editMode.CREATE) {
            // 新規作成モードでフォームをクリア
            setFormData({
                title: '',
                description: '',
                order: 0,
                startDate: undefined,
                endDate: undefined,
            });
        }
    }, [mode, training]);

    const handleSave = () => {
        if (!formData.title || !formData.description) {
            alert('タイトルと説明は必須です');
            return;
        }

        const trainingData: Training = {
            id: mode === editMode.UPDATE ? trainingId : `new-${Date.now()}`,
            title: formData.title!,
            description: formData.description!,
            order: formData.order || 0,
            startDate: formData.startDate || dayjs(),
            endDate: formData.endDate || dayjs().add(1, 'day'),
            updateDateTime: dayjs(),
            updateUserId: 'current-user'
        };

        // TODO: APIでデータを保存
        console.log('保存:', trainingData);
        alert(`研修「${trainingData.title}」を保存しました`);
        
        onClose();
    };

    const handleInputChange = (field: keyof Training) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        let value: any = event.target.value;
        
        if (field === 'order') {
            value = parseInt(event.target.value) || 0;
        } else if (field === 'startDate' || field === 'endDate') {
            value = value ? dayjs(value) : undefined;
        }
        
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                    <TextField
                        label="タイトル"
                        value={formData.title || ''}
                        onChange={handleInputChange('title')}
                        fullWidth
                        required
                    />
                    <TextField
                        label="説明"
                        value={formData.description || ''}
                        onChange={handleInputChange('description')}
                        fullWidth
                        required
                        multiline
                        rows={3}
                    />
                    <TextField
                        label="実施順"
                        type="number"
                        value={formData.order || ''}
                        onChange={handleInputChange('order')}
                        fullWidth
                    />
                    <TextField
                        label="開始日"
                        type="date"
                        value={formData.startDate ? formData.startDate.format('YYYY-MM-DD') : ''}
                        onChange={handleInputChange('startDate')}
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        label="終了日"
                        type="date"
                        value={formData.endDate ? formData.endDate.format('YYYY-MM-DD') : ''}
                        onChange={handleInputChange('endDate')}
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Box>
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={handleSave}
                    variant="contained"
                >
                    {mode === editMode.UPDATE ? '更新' : '作成'}
                </Button>
                <Button
                    variant="outlined"
                    onClick={onClose}>
                    キャンセル
                </Button>
            </DialogActions>
        </>
    );
};

export const TrainingEditDialog = (props: Props) => {
    const { trainingId, mode, open, onClose } = props;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                {mode === editMode.UPDATE ? '研修を編集' : '新しい研修を作成'}
            </DialogTitle>

            {mode === editMode.UPDATE ? (
                <Suspense fallback={
                    <DialogContent>
                        <Box display="flex" justifyContent="center" py={4}>
                            <CircularProgress />
                        </Box>
                    </DialogContent>
                }>
                    <TrainingEditForm
                        trainingId={trainingId}
                        mode={mode}
                        onClose={onClose}
                    />
                </Suspense>
            ) : (
                <TrainingEditForm
                    trainingId={trainingId}
                    mode={mode}
                    onClose={onClose}
                />
            )}
        </Dialog>
    );
}