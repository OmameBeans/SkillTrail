import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    CircularProgress,
    Autocomplete
} from "@mui/material";
import { useState, useEffect, Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { EditMode } from "../../../shared/type";
import { editMode } from "../../../shared/type";
import type { Phase } from "../../../entities/phase";
import type { Training } from "../../../entities/training";
import dayjs from "dayjs";

type Props = {
    phaseId: string;
    mode: EditMode;
    open: boolean;
    onClose: () => void;
    trainingId?: string; // 親から渡される研修ID（オプショナル）
}

// モックAPI関数
const fetchPhase = async (id: string): Promise<Phase> => {
    // 実際のAPIコールに置き換える
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id,
                name: `フェーズ名 ${id}`,
                trainingId: '1',
                description: `フェーズの説明 ${id}`,
                order: parseInt(id),
                startDate: dayjs('2025-02-01'),
                endDate: dayjs('2025-02-05'),
                updateDateTime: dayjs(),
                updateUserId: 'current-user'
            });
        }, 500);
    });
};

// 研修一覧を取得するモック関数
const fetchTrainings = async (): Promise<Training[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: '1',
                    title: 'React基礎研修',
                    description: 'Reactの基礎を学ぶ研修',
                    order: 1,
                    startDate: dayjs('2025-02-01'),
                    endDate: dayjs('2025-02-05'),
                    updateDateTime: dayjs('2025-01-15 10:30'),
                    updateUserId: 'user001'
                },
                {
                    id: '2',
                    title: 'TypeScript入門',
                    description: 'TypeScriptの基礎を学ぶ研修',
                    order: 2,
                    startDate: dayjs('2025-02-10'),
                    endDate: dayjs('2025-02-15'),
                    updateDateTime: dayjs('2025-01-20 14:45'),
                    updateUserId: 'user002'
                },
                {
                    id: '3',
                    title: 'Node.js実践',
                    description: 'Node.jsでのサーバー開発を学ぶ研修',
                    order: 3,
                    startDate: dayjs('2025-02-20'),
                    endDate: dayjs('2025-02-25'),
                    updateDateTime: dayjs('2025-01-25 09:15'),
                    updateUserId: 'user003'
                },
            ]);
        }, 300);
    });
};

// フォームコンポーネント（Suspense内で使用）
const PhaseEditForm = ({ phaseId, mode, onClose, trainingId }: {
    phaseId: string;
    mode: EditMode;
    onClose: () => void;
    trainingId?: string;
}) => {
    const [formData, setFormData] = useState<Partial<Phase>>({
        name: '',
        trainingId: '',
        description: '',
        order: 0,
        startDate: undefined,
        endDate: undefined,
    });

    const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);

    // 研修一覧を取得
    const trainings = useSuspenseQuery({
        queryKey: ['trainings'],
        queryFn: fetchTrainings,
    }).data;

    // 編集モードの場合のみuseSuspenseQueryを使用
    const phase = mode === editMode.UPDATE ?
        useSuspenseQuery({
            queryKey: ['phase', phaseId],
            queryFn: () => fetchPhase(phaseId),
        }).data : null;

    // 編集モードでデータを取得した際にフォームに設定
    useEffect(() => {
        if (mode === editMode.UPDATE && phase) {
            setFormData({
                name: phase.name,
                trainingId: phase.trainingId,
                description: phase.description,
                order: phase.order,
                startDate: phase.startDate,
                endDate: phase.endDate,
            });
            // 研修も設定
            const training = trainings.find(t => t.id === phase.trainingId);
            setSelectedTraining(training || null);
        } else if (mode === editMode.CREATE) {
            // 新規作成モードでフォームをクリア
            setFormData({
                name: '',
                trainingId: trainingId || '', // 親から渡された研修IDを設定
                description: '',
                order: 0,
                startDate: undefined,
                endDate: undefined,
            });
            // 親から渡された研修IDがある場合、対応する研修を選択
            if (trainingId) {
                const training = trainings.find(t => t.id === trainingId);
                setSelectedTraining(training || null);
            } else {
                setSelectedTraining(null);
            }
        }
    }, [mode, phase, trainings, trainingId]);

    const handleSave = () => {
        if (!formData.name || !selectedTraining || !formData.description) {
            alert('フェーズ名、研修、説明は必須です');
            return;
        }

        const phaseData: Phase = {
            id: mode === editMode.UPDATE ? phaseId : `new-${Date.now()}`,
            name: formData.name!,
            trainingId: selectedTraining.id,
            description: formData.description!,
            order: formData.order || 0,
            startDate: formData.startDate || dayjs(),
            endDate: formData.endDate || dayjs().add(1, 'day'),
            updateDateTime: dayjs(),
            updateUserId: 'current-user'
        };

        // TODO: APIでデータを保存
        console.log('保存:', phaseData);
        alert(`フェーズ「${phaseData.name}」を保存しました`);

        onClose();
    };

    const handleTrainingChange = (newTraining: Training | null) => {
        setSelectedTraining(newTraining);
        setFormData(prev => ({
            ...prev,
            trainingId: newTraining?.id || ''
        }));
    };

    const handleInputChange = (field: keyof Phase) => (
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
                        label="フェーズ名"
                        value={formData.name || ''}
                        onChange={handleInputChange('name')}
                        fullWidth
                        required
                    />
                    <Autocomplete
                        options={trainings}
                        getOptionLabel={(option) => option.title}
                        value={selectedTraining}
                        onChange={(_, newValue) => handleTrainingChange(newValue)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="研修"
                                required
                                error={!selectedTraining}
                                helperText={!selectedTraining ? '研修を選択してください' : ''}
                            />
                        )}
                        fullWidth
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

export const PhaseEditDialog = (props: Props) => {
    const { phaseId, mode, open, onClose, trainingId } = props;

    console.log('PhaseEditDialog props:', props);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                {mode === editMode.UPDATE ? 'フェーズを編集' : '新しいフェーズを作成'}
            </DialogTitle>

            {mode === editMode.UPDATE ? (
                <Suspense fallback={
                    <DialogContent>
                        <Box display="flex" justifyContent="center" py={4}>
                            <CircularProgress />
                        </Box>
                    </DialogContent>
                }>
                    <PhaseEditForm
                        phaseId={phaseId}
                        mode={mode}
                        onClose={onClose}
                        trainingId={trainingId}
                    />
                </Suspense>
            ) : (
                <PhaseEditForm
                    phaseId={phaseId}
                    mode={mode}
                    onClose={onClose}
                    trainingId={trainingId}
                />
            )}
        </Dialog>
    );
}
