# SkillTrail システム仕様書

## システム概要

### プロジェクト名
**SkillTrail** - スキル習得管理システム

### 目的
個人や組織のスキル向上を体系的に管理し、学習進捗を効率的に追跡することを目的とした Web アプリケーションです。

### 対象ユーザー
- **研修生（Trainee）**: スキル習得を行う学習者
- **管理者（Admin）**: 研修プログラムを管理する担当者

## 機能仕様

### 1. ユーザー管理機能

#### 1.1 ユーザー登録・管理
- ユーザーアカウントの作成
- ロール設定（研修生/管理者）
- ユーザー情報の編集

#### 1.2 認証・認可
- ログイン機能（将来実装予定）
- ロールベースのアクセス制御
- セッション管理

### 2. タスク管理機能

#### 2.1 タスクの CRUD 操作
- **作成**: 新しい学習タスクの登録
- **参照**: タスク一覧・詳細の表示
- **更新**: タスク情報の編集
- **削除**: 不要タスクの削除

#### 2.2 タスクの属性
- タイトル（必須）
- 説明
- 所属カテゴリ
- 表示順序

#### 2.3 タスクの並び替え
- ドラッグ&ドロップによる順序変更
- カテゴリ内での順序管理

### 3. カテゴリ管理機能

#### 3.1 階層構造管理
- 親子関係を持つカテゴリ構造
- ツリー表示による視覚的管理
- カテゴリの追加・編集・削除

#### 3.2 カテゴリの属性
- タイトル（必須）
- 説明
- 親カテゴリ（階層構造用）
- 表示順序

### 4. 進捗管理機能

#### 4.1 進捗ステータス
- **未開始（NotStarted）**: タスクに着手していない状態
- **進行中（InProgress）**: タスクを実行中の状態
- **完了（Completed）**: タスクを完了した状態

#### 4.2 進捗追跡
- ユーザー別の進捗状況記録
- タスク別の完了率表示
- 進捗履歴の管理

### 5. 管理者機能

#### 5.1 管理ダッシュボード
- システム利用状況の概要表示
- 管理メニューへのナビゲーション

#### 5.2 タスク管理画面
- タスクの一覧表示（DataGrid）
- カテゴリ別フィルタリング
- タスクの一括操作

#### 5.3 カテゴリ管理画面
- ツリー形式でのカテゴリ表示
- ドラッグ&ドロップによる構造変更

## 技術仕様

### システム要件

#### サーバー要件
- **OS**: Windows Server 2019 以上 / Linux (Ubuntu 20.04 以上)
- **ランタイム**: .NET 8.0
- **データベース**: SQL Server 2019 以上
- **メモリ**: 最小 4GB、推奨 8GB 以上
- **ディスク**: 最小 10GB の空き容量

#### クライアント要件
- **ブラウザ**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **JavaScript**: 有効化必須
- **ネットワーク**: HTTPS 通信対応

### 技術スタック詳細

#### バックエンド技術
```
Framework: ASP.NET Core 8.0
ORM: Entity Framework Core 8.0
Database: SQL Server 2019+
API Design: REST API
Documentation: Swagger/OpenAPI 3.0
```

#### フロントエンド技術
```
Framework: React 19.x
Language: TypeScript 5.8+
UI Library: Material-UI 7.x
State Management: React Query 5.x
Build Tool: Vite 7.x
Testing: Jest + React Testing Library (予定)
```

### データベース設計

#### テーブル設計
1. **Users**: ユーザー情報
2. **TaskCategories**: タスクカテゴリ（階層構造）
3. **Tasks**: 学習タスク
4. **Progress**: 進捗情報

#### 関連図
```
Users 1:N Progress N:1 Tasks N:1 TaskCategories
                                    ↕ (Self-Reference)
                                TaskCategories
```

### API 仕様

#### 認証
- 将来的に JWT Bearer Token による認証を実装予定
- 現在は仮の認証機構で動作

#### エンドポイント一覧

**Task API**
```
GET    /api/task/get                 - 全タスク取得
GET    /api/task/get/{id}            - 特定タスク取得
POST   /api/task/getbycategory       - カテゴリ別タスク取得
POST   /api/task/create              - タスク作成
POST   /api/task/update              - タスク更新
POST   /api/task/delete              - タスク削除
POST   /api/task/reorder             - タスク並び替え
```

**TaskCategory API**
```
GET    /api/taskcategory/get         - 全カテゴリ取得
POST   /api/taskcategory/create      - カテゴリ作成
POST   /api/taskcategory/update      - カテゴリ更新
POST   /api/taskcategory/delete      - カテゴリ削除
```

**User API**
```
GET    /api/user/get                 - 全ユーザー取得
POST   /api/user/create              - ユーザー作成
POST   /api/user/update              - ユーザー更新
```

#### レスポンス形式
```json
{
  "isSuccess": true,
  "data": {...},
  "errorMessages": []
}
```

### セキュリティ仕様

#### データ保護
- HTTPS 通信の強制
- SQL インジェクション対策（パラメータ化クエリ）
- XSS 対策（入力値サニタイズ）
- CSRF 対策（Anti-Forgery Token）

#### アクセス制御
- ロールベースアクセス制御（RBAC）
- 管理者機能への適切な制限
- データ改ざん防止

### パフォーマンス仕様

#### 応答時間
- API レスポンス: 平均 200ms 以下
- ページ表示: 初回 2秒以下、2回目以降 1秒以下

#### 同時接続数
- 想定同時利用者数: 100人
- 最大同時接続数: 500接続

## 運用仕様

### バックアップ戦略
- **データベース**: 日次自動バックアップ
- **アプリケーション**: ソースコード管理（Git）
- **設定ファイル**: 構成管理ツールによる管理

### 監視項目
- サーバーリソース使用率
- API レスポンス時間
- エラー発生率
- データベース接続状況

### ログ管理
- アプリケーションログ（情報、警告、エラー）
- アクセスログ
- セキュリティログ
- パフォーマンスログ

## 今後の開発計画

### Phase 1: 基本機能の充実（1-2ヶ月）
- ユーザー認証機能の実装
- 進捗機能の UI 改善
- テストコードの作成

### Phase 2: 機能拡張（3-4ヶ月）
- レポート・ダッシュボード機能
- 通知機能
- エクスポート/インポート機能

### Phase 3: 高度な機能（5-6ヶ月）
- AI による学習推奨機能
- モバイルアプリ対応
- リアルタイム協調機能

### Phase 4: エンタープライズ対応（7-12ヶ月）
- マルチテナント機能
- 高可用性対応
- 国際化対応

## サポート情報

### 技術サポート
- **開発者ドキュメント**: `/DEVELOPMENT.md`
- **アーキテクチャガイド**: `/ARCHITECTURE.md`
- **API ドキュメント**: Swagger UI

### 参考資料
- [ASP.NET Core ドキュメント](https://docs.microsoft.com/aspnet/core/)
- [React ドキュメント](https://reactjs.org/docs/)
- [Material-UI ドキュメント](https://mui.com/)
- [Entity Framework Core ドキュメント](https://docs.microsoft.com/ef/core/)

---

**最終更新**: 2025年1月27日  
**バージョン**: 1.0.0  
**作成者**: SkillTrail 開発チーム