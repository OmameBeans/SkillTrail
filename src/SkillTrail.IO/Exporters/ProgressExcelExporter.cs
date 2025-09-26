using ClosedXML.Excel;
using SkillTrail.Biz.Entites;
using SkillTrail.Biz.Interfaces;
using SkillTrail.Biz.Extensions;

namespace SkillTrail.IO.Exporters
{
    public class ProgressExcelExporter : IProgressExcelExporter
    {
        private const string DefaultFontName = "Meiryo UI"; // 既定フォント

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

            // 既定フォント
            workbook.Style.Font.FontName = DefaultFontName;
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
        /// ヘッダーセルのスタイルを設定（優しい色味）
        /// </summary>
        private static void StyleHeaderCell(IXLCell cell, bool isUserColumn)
        {
            cell.Style.Font.Bold = true;
            cell.Style.Font.FontColor = XLColor.DarkSlateGray;
            cell.Style.Font.FontSize = 11;
            cell.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;

            if (isUserColumn)
            {
                cell.Style.Fill.BackgroundColor = XLColor.LightSkyBlue;
            }
            else
            {
                cell.Style.Fill.BackgroundColor = XLColor.LightSteelBlue;
            }

            cell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            cell.Style.Border.OutsideBorderColor = XLColor.LightGray;
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
        /// ユーザーセルのスタイルを設定（優しい色味）
        /// </summary>
        private static void StyleUserCell(IXLCell cell, bool isAlternateRow)
        {
            cell.Style.Font.FontSize = 11;
            cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Left;
            cell.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;

            // 交互行で背景色を穏やかに変更
            cell.Style.Fill.BackgroundColor = XLColor.WhiteSmoke;

            cell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            cell.Style.Border.OutsideBorderColor = XLColor.Gainsboro;
        }

        /// <summary>
        /// 進捗セルのスタイルを設定（優しい色味）
        /// </summary>
        private static void StyleProgressCell(IXLCell cell, string status, bool isAlternateRow)
        {
            cell.Style.Font.FontSize = 10;
            cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
            cell.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;

            // 進捗状況に応じた背景色、フォント色、スタイルを適用（優しい色）
            var (backgroundColor, fontColor, isBold) = GetProgressStatusStyle(status);

            cell.Style.Fill.BackgroundColor = backgroundColor;
            cell.Style.Font.FontColor = fontColor;
            cell.Style.Font.Bold = isBold;

            // 枠線は控えめに
            cell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            cell.Style.Border.OutsideBorderColor = XLColor.Gainsboro;

            // 強い装飾は行わない
            ApplyProgressSpecialEffects(cell, status);
        }

        /// <summary>
        /// 進捗状況に応じたスタイル（背景色、フォント色、太字）を取得（優しい色味）
        /// </summary>
        private static (XLColor backgroundColor, XLColor fontColor, bool isBold) GetProgressStatusStyle(string status)
        {
            return status switch
            {
                "完了" => (XLColor.Honeydew, XLColor.DarkGreen, false),
                "進行中" => (XLColor.LemonChiffon, XLColor.DarkOrange, false),
                "未着手" => (XLColor.MistyRose, XLColor.Firebrick, false),
                "未設定" => (XLColor.WhiteSmoke, XLColor.DimGray, false),
                _ => (XLColor.White, XLColor.Black, false)
            };
        }

        /// <summary>
        /// 進捗状況に応じた特別なエフェクトを適用（穏やかにするため未使用）
        /// </summary>
        private static void ApplyProgressSpecialEffects(IXLCell cell, string status)
        {
            // 強調しすぎないよう、特別な枠線の変更などは行わない
            // 必要であればここでごく薄い調整を行う
        }

        /// <summary>
        /// テーブル全体のスタイルを適用（優しい色味）
        /// </summary>
        private static void ApplyTableStyling(IXLWorksheet worksheet, int traineeCount, int taskCount)
        {
            var totalRows = traineeCount + 1; // ヘッダー行 + データ行
            var totalCols = taskCount + 1; // ユーザー列 + タスク列

            // テーブル全体の外枠は控えめに
            var tableRange = worksheet.Range(1, 1, totalRows, totalCols);
            tableRange.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            tableRange.Style.Border.OutsideBorderColor = XLColor.Gainsboro;

            // ヘッダー行の下も控えめに
            var headerBottomRange = worksheet.Range(1, 1, 1, totalCols);
            headerBottomRange.Style.Border.BottomBorder = XLBorderStyleValues.Thin;
            headerBottomRange.Style.Border.BottomBorderColor = XLColor.Gainsboro;

            // ユーザー列の右も控えめに
            var userColumnRange = worksheet.Range(1, 1, totalRows, 1);
            userColumnRange.Style.Border.RightBorder = XLBorderStyleValues.Thin;
            userColumnRange.Style.Border.RightBorderColor = XLColor.Gainsboro;
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
