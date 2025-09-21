using ClosedXML.Excel;
using SkillTrail.Biz.Entites;
using SkillTrail.Biz.Interfaces;
using SkillTrail.Biz.Extensions;

namespace SkillTrail.IO.Exporters
{
    public class ProgressExcelExporter : IProgressExcelExporter
    {
        public async Task<Stream> ExportAsync(IReadOnlyCollection<User> trainees, IReadOnlyCollection<Biz.Entites.Task> tasks, string groupName)
        {
            return await System.Threading.Tasks.Task.Run(() =>
            
{
                var progressDict = new Dictionary<(string, string), string>();
                foreach (var trainee in trainees)
                {
                    foreach (var progress in trainee.Progresses)
                    {
                        progressDict.TryAdd((trainee.Id, progress.TaskId), progress.Status.ToDisplayString());
                    }
                }

                using var workbook = new XLWorkbook();
                SetupWorkbookProperties(workbook, groupName);
                
                var worksheet = workbook.Worksheets.Add("進捗一覧");
                
                // ヘッダー行の設定
                SetupHeaderRow(worksheet, tasks);
                
                // データ行の設定
                PopulateDataRows(worksheet, trainees, tasks, progressDict);
                
                // フリーズペインの設定（1列目と1行目を固定）
                worksheet.SheetView.Freeze(1, 1);
                
                // テーブル全体のスタイル適用
                ApplyTableStyling(worksheet, trainees.Count, tasks.Count);
                
                // 列幅の調整
                AdjustColumnWidths(worksheet, tasks.Count);

                var stream = new MemoryStream();
                workbook.SaveAs(stream);
                stream.Position = 0;
                return stream;
            });
        }

        /// <summary>
        /// ワークブックのプロパティを設定
        /// </summary>
        private static void SetupWorkbookProperties(XLWorkbook workbook, string groupName)
        {
            workbook.Properties.Title = $"進捗一覧_{groupName}";
            workbook.Properties.Author = "SkillTrail System";
            workbook.Properties.Subject = "進捗管理表";
            workbook.Properties.Created = DateTime.Now;
        }

        /// <summary>
        /// ヘッダー行を設定
        /// </summary>
        private static void SetupHeaderRow(IXLWorksheet worksheet, IReadOnlyCollection<Biz.Entites.Task> tasks)
        {
            // タスクヘッダー
            foreach (var (task, index) in tasks.Select((task, index) => (task, index)))
            {
                var headerCell = worksheet.Cell(1, index + 2);
                headerCell.SetValue(task.Title);
                StyleHeaderCell(headerCell, isUserColumn: false);
            }
        }

        /// <summary>
        /// ヘッダーセルのスタイルを設定
        /// </summary>
        private static void StyleHeaderCell(IXLCell cell, bool isUserColumn)
        {
            cell.Style.Font.Bold = true;
            cell.Style.Font.FontColor = XLColor.White;
            cell.Style.Font.FontSize = 12;
            cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
            cell.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
            
            if (isUserColumn)
            {
                cell.Style.Fill.BackgroundColor = XLColor.DarkSlateBlue;
            }
            else
            {
                cell.Style.Fill.BackgroundColor = XLColor.SteelBlue;
            }
            
            cell.Style.Border.OutsideBorder = XLBorderStyleValues.Medium;
            cell.Style.Border.OutsideBorderColor = XLColor.DarkBlue;
        }

        /// <summary>
        /// データ行を設定
        /// </summary>
        private static void PopulateDataRows(IXLWorksheet worksheet, IReadOnlyCollection<User> trainees, 
            IReadOnlyCollection<Biz.Entites.Task> tasks, Dictionary<(string, string), string> progressDict)
        {
            var row = 2; // ヘッダー行の次から開始
            var isAlternateRow = false;

            foreach (var trainee in trainees)
            {
                // ユーザー名セル（固定列）
                var userCell = worksheet.Cell(row, 1);
                userCell.SetValue($"{trainee.Id} {trainee.Name}");
                StyleUserCell(userCell, isAlternateRow);

                // 進捗データセル
                foreach (var (task, index) in tasks.Select((task, index) => (task, index)))
                {
                    var cellValue = progressDict.TryGetValue((trainee.Id, task.Id), out var status)
                        ? status
                        : ProgressStatus.NotStarted.ToDisplayString();
                    
                    var dataCell = worksheet.Cell(row, index + 2);
                    dataCell.SetValue(cellValue);
                    
                    // 進捗セルに背景色を設定
                    StyleProgressCell(dataCell, cellValue, isAlternateRow);
                }
                
                row++;
                isAlternateRow = !isAlternateRow; // 行の色を交互に変更
            }
        }

        /// <summary>
        /// ユーザーセルのスタイルを設定
        /// </summary>
        private static void StyleUserCell(IXLCell cell, bool isAlternateRow)
        {
            cell.Style.Font.Bold = true;
            cell.Style.Font.FontSize = 11;
            cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Left;
            cell.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
            
            // 交互行で背景色を変更
            cell.Style.Fill.BackgroundColor = isAlternateRow ? XLColor.Lavender : XLColor.AliceBlue;
            
            cell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            cell.Style.Border.OutsideBorderColor = XLColor.Gray;
        }

        /// <summary>
        /// 進捗セルのスタイルを設定（進捗状況に応じた背景色）
        /// </summary>
        private static void StyleProgressCell(IXLCell cell, string status, bool isAlternateRow)
        {
            cell.Style.Font.FontSize = 10;
            cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
            cell.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
            
            // 進捗状況に応じた背景色、フォント色、スタイルを適用
            var (backgroundColor, fontColor, isBold) = GetProgressStatusStyle(status);
            
            cell.Style.Fill.BackgroundColor = backgroundColor;
            cell.Style.Font.FontColor = fontColor;
            cell.Style.Font.Bold = isBold;
            
            // 枠線の設定
            cell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            cell.Style.Border.OutsideBorderColor = XLColor.Gray;
            
            // 進捗状況によって特別なスタイルを追加
            ApplyProgressSpecialEffects(cell, status);
        }

        /// <summary>
        /// 進捗状況に応じたスタイル（背景色、フォント色、太字）を取得
        /// </summary>
        private static (XLColor backgroundColor, XLColor fontColor, bool isBold) GetProgressStatusStyle(string status)
        {
            return status switch
            {
                "完了" => (XLColor.LightGreen, XLColor.DarkGreen, true),
                "進行中" => (XLColor.LightYellow, XLColor.DarkOrange, true),
                "未着手" => (XLColor.LightCoral, XLColor.DarkRed, false),
                "未設定" => (XLColor.LightGray, XLColor.DimGray, false),
                _ => (XLColor.White, XLColor.Black, false)
            };
        }

        /// <summary>
        /// 進捗状況に応じた特別なエフェクトを適用
        /// </summary>
        private static void ApplyProgressSpecialEffects(IXLCell cell, string status)
        {
            switch (status)
            {
                case "完了":
                    // 完了の場合は太い緑の枠線
                    cell.Style.Border.OutsideBorder = XLBorderStyleValues.Medium;
                    cell.Style.Border.OutsideBorderColor = XLColor.DarkGreen;
                    break;
                
                case "進行中":
                    // 進行中の場合は破線の枠線
                    cell.Style.Border.OutsideBorder = XLBorderStyleValues.Dashed;
                    cell.Style.Border.OutsideBorderColor = XLColor.Orange;
                    break;
                
                case "未着手":
                    // 未着手の場合は点線の枠線
                    cell.Style.Border.OutsideBorder = XLBorderStyleValues.Dotted;
                    cell.Style.Border.OutsideBorderColor = XLColor.Red;
                    break;
                
                case "未設定":
                    // 未設定の場合は薄い枠線
                    cell.Style.Border.OutsideBorder = XLBorderStyleValues.Hair;
                    cell.Style.Border.OutsideBorderColor = XLColor.LightGray;
                    break;
            }
        }

        /// <summary>
        /// テーブル全体のスタイルを適用
        /// </summary>
        private static void ApplyTableStyling(IXLWorksheet worksheet, int traineeCount, int taskCount)
        {
            var totalRows = traineeCount + 1; // ヘッダー行 + データ行
            var totalCols = taskCount + 1; // ユーザー列 + タスク列

            // テーブル全体の外枠に太い罫線
            var tableRange = worksheet.Range(1, 1, totalRows, totalCols);
            tableRange.Style.Border.OutsideBorder = XLBorderStyleValues.Thick;
            tableRange.Style.Border.OutsideBorderColor = XLColor.DarkBlue;

            // ヘッダー行の下に太い罫線
            var headerBottomRange = worksheet.Range(1, 1, 1, totalCols);
            headerBottomRange.Style.Border.BottomBorder = XLBorderStyleValues.Medium;
            headerBottomRange.Style.Border.BottomBorderColor = XLColor.DarkBlue;

            // ユーザー列の右に太い罫線
            var userColumnRange = worksheet.Range(1, 1, totalRows, 1);
            userColumnRange.Style.Border.RightBorder = XLBorderStyleValues.Medium;
            userColumnRange.Style.Border.RightBorderColor = XLColor.DarkBlue;
        }

        /// <summary>
        /// 列幅を調整
        /// </summary>
        private static void AdjustColumnWidths(IXLWorksheet worksheet, int taskCount)
        {
            // ユーザー名列を少し広めに設定
            worksheet.Column(1).Width = 25;
            
            // タスク列の幅を調整
            for (int i = 2; i <= taskCount + 1; i++)
            {
                worksheet.Column(i).AdjustToContents();
                
                // 最小幅と最大幅を設定
                if (worksheet.Column(i).Width < 12)
                    worksheet.Column(i).Width = 12;
                else if (worksheet.Column(i).Width > 25)
                    worksheet.Column(i).Width = 25;
            }
        }
    }
}
