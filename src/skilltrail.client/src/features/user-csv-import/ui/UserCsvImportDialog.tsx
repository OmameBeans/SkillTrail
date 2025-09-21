import { useState, useRef } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Alert,
    LinearProgress,
    Paper,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import { CloudUpload, Download } from '@mui/icons-material';
import { useImportUsersFromCsv } from '../../../entities/user/api/queries';
import { useSnackbar } from 'notistack';

interface UserCsvImportDialogProps {
    open: boolean;
    onClose: () => void;
}

export const UserCsvImportDialog = ({ open, onClose }: UserCsvImportDialogProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [importResult, setImportResult] = useState<{ imported: number; failed: number } | null>(null);

    const { enqueueSnackbar } = useSnackbar();

    const importMutation = useImportUsersFromCsv();

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === 'text/csv') {
            setSelectedFile(file);
            setImportResult(null);
        } else {
            alert('CSVファイルを選択してください');
        }
    };

    const handleImport = async () => {
        if (selectedFile) {
            try {
                const result = await importMutation.mutateAsync(selectedFile);
                if (result.data) {
                    if (result.hasError) {
                        enqueueSnackbar('一部のユーザーのインポートに失敗しました', { variant: 'error' });
                    }
                    enqueueSnackbar('ユーザーのインポートが完了しました', { variant: 'success' });
                    setImportResult(result.data);
                    onClose();
                }
            } catch (error) {
                console.error('Import failed:', error);
            }
        }
    };

    const handleClose = () => {
        setSelectedFile(null);
        setImportResult(null);
        importMutation.reset();
        onClose();
    };

    const downloadTemplate = () => {
        const csvContent = 'id,name,groupId,role\nexample_user,サンプルユーザー,,1\n';
        
        // UTF-8 BOM (Byte Order Mark) を追加
        const BOM = '\uFEFF';
        const csvWithBom = BOM + csvContent;
        
        // UTF-8エンコーディングでBlobを作成
        const blob = new Blob([csvWithBom], { 
            type: 'text/csv;charset=utf-8;' 
        });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'user_template.csv';
        link.click();
        
        // メモリリークを防ぐためにURLを解放
        URL.revokeObjectURL(link.href);
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>ユーザーCSVインポート</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* テンプレートダウンロード */}
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            CSVテンプレート
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            インポート用のCSVファイルのテンプレートをダウンロードできます
                        </Typography>
                        <Button
                            variant="outlined"
                            startIcon={<Download />}
                            onClick={downloadTemplate}
                        >
                            テンプレートダウンロード
                        </Button>
                    </Paper>

                    {/* ファイル選択 */}
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            CSVファイル選択
                        </Typography>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileSelect}
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Button
                                variant="outlined"
                                startIcon={<CloudUpload />}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                ファイルを選択
                            </Button>
                            {selectedFile && (
                                <Typography variant="body2">
                                    選択されたファイル: {selectedFile.name}
                                </Typography>
                            )}
                        </Box>
                    </Paper>

                    {/* CSVフォーマット説明 */}
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            CSVフォーマット
                        </Typography>
                        <List dense>
                            <ListItem>
                                <ListItemText
                                    primary="カラム構成"
                                    secondary="id, name, groupId, role の順で記載してください"
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="role値"
                                    secondary="0: 未設定, 1: 受講者, 2: 管理者"
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="グループId"
                                    secondary="グループ管理ページで確認してください"
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="文字エンコード"
                                    secondary="UTF-8を使用してください"
                                />
                            </ListItem>
                        </List>
                    </Paper>

                    {/* インポート進行状況 */}
                    {importMutation.isPending && (
                        <Box>
                            <Typography variant="body2" gutterBottom>
                                インポート中...
                            </Typography>
                            <LinearProgress />
                        </Box>
                    )}

                    {/* エラー表示 */}
                    {importMutation.error && (
                        <Alert severity="error">
                            {importMutation.error.message}
                        </Alert>
                    )}

                    {/* インポート結果 */}
                    {importResult && (
                        <Alert severity="success">
                            インポートが完了しました。
                            成功: {importResult.imported}件、失敗: {importResult.failed}件
                        </Alert>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleImport}
                    variant="contained"
                    disabled={!selectedFile || importMutation.isPending}
                >
                    インポート実行
                </Button>
                <Button onClick={handleClose}>
                    {importResult ? '閉じる' : 'キャンセル'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
