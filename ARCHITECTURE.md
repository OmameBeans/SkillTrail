# アーキテクチャ設計書

## システムアーキテクチャ概要

SkillTrailは、モダンなフルスタック Web アプリケーションとして設計されており、以下の原則に基づいています：

- **関心の分離（Separation of Concerns）**
- **依存性の逆転（Dependency Inversion）**
- **単一責任の原則（Single Responsibility Principle）**
- **スケーラビリティとメンテナンス性**

## バックエンドアーキテクチャ

### レイヤー構造

```
┌─────────────────────────────────────┐
│           Web API Layer             │  ← Controllers, Program.cs
├─────────────────────────────────────┤
│        Application Layer            │  ← Application Services
├─────────────────────────────────────┤
│          Business Layer             │  ← Entities, Interfaces
├─────────────────────────────────────┤
│       Data Access Layer            │  ← Repositories, DbContext
├─────────────────────────────────────┤
│          Infrastructure            │  ← Database, External APIs
└─────────────────────────────────────┘
```

### プロジェクト構成詳細

#### SkillTrail.Server（Web API Layer）
**責務**: HTTP リクエスト/レスポンスの処理、認証・認可

**主要コンポーネント**:
- `Controllers/` - REST API エンドポイント
- `Program.cs` - DI コンテナ設定、ミドルウェア設定
- `UserContextAdapter.cs` - ユーザーコンテキストの実装

**設計パターン**:
- **Controller パターン** - HTTP リクエストの処理
- **Dependency Injection** - 依存性の注入

#### SkillTrail.Biz（Business Layer）
**責務**: ビジネスロジック、ドメインルール

**主要コンポーネント**:
- `Entities/` - ドメインエンティティ
- `ApplicationServices/` - アプリケーションサービス
- `Interfaces/` - 抽象化インターフェース
- `Result.cs` - 統一された戻り値型

**設計パターン**:
- **Domain-Driven Design (DDD)** - ドメイン中心設計
- **Application Service パターン** - ビジネスロジックの組織化
- **Result パターン** - エラーハンドリングの統一

#### SkillTrail.Data（Data Access Layer）
**責務**: データベースアクセス、データ永続化

**主要コンポーネント**:
- `DbContexts/` - Entity Framework Core コンテキスト
- `Repositories/` - リポジトリパターン実装
- `Migrations/` - データベーススキーマ管理

**設計パターン**:
- **Repository パターン** - データアクセスの抽象化
- **Unit of Work パターン** - トランザクション管理
- **Code First アプローチ** - スキーマ管理

### データベース設計

```sql
Users
├── Id (Primary Key)
├── Name
├── Role (enum)
├── UpdateDateTime
└── UpdateUserId

TaskCategories
├── Id (Primary Key)
├── Title
├── Description
├── CategoryId (Self-Reference)
├── Order
├── UpdateDateTime
└── UpdateUserId

Tasks
├── Id (Primary Key)
├── Title
├── Description
├── CategoryId (Foreign Key → TaskCategories)
├── Order
├── UpdateDateTime
└── UpdateUserId

Progress
├── Id (Primary Key)
├── TaskId (Foreign Key → Tasks)
├── UserId (Foreign Key → Users)
├── Status (enum)
├── UpdateDateTime
└── UpdateUserId
```

### API 設計原則

#### RESTful API
- **リソース指向** - URL でリソースを表現
- **HTTP メソッド** - 適切な HTTP 動詞の使用
- **ステートレス** - サーバー側での状態管理なし

#### 統一レスポンス形式
```csharp
public class Result<T>
{
    public bool IsSuccess { get; set; }
    public T? Data { get; set; }
    public List<string> ErrorMessages { get; set; } = [];
}
```

## フロントエンドアーキテクチャ

### Feature-Sliced Design (FSD)

```
src/
├── app/                    # アプリケーション初期化
│   ├── app/                # App コンポーネント
│   ├── layout/             # レイアウトコンポーネント
│   └── router/             # ルーティング設定
├── pages/                  # ページコンポーネント
│   ├── admin/              # 管理者ページ
│   ├── admin-task/         # タスク管理ページ
│   └── auto-redirect/      # リダイレクトページ
├── features/               # 機能単位コンポーネント
│   ├── current-user/       # ユーザー管理機能
│   ├── task/               # タスク機能
│   └── task-category-edit-tree/ # カテゴリ編集機能
├── entities/               # ビジネスエンティティ
│   ├── user/               # ユーザーエンティティ
│   ├── task/               # タスクエンティティ
│   └── task-category/      # カテゴリエンティティ
└── shared/                 # 共通コンポーネント
    ├── ui/                 # UI コンポーネント
    └── type/               # 型定義
```

### 状態管理戦略

#### React Query
- **サーバー状態** - API データのキャッシュ管理
- **自動同期** - バックグラウンドでのデータ更新
- **エラーハンドリング** - ネットワークエラーの統一処理

#### React Context
- **グローバル状態** - ユーザー認証情報
- **テーマ設定** - UI テーマの管理

### コンポーネント設計原則

#### 単一責任原則
- 各コンポーネントは一つの責務のみを持つ
- UI コンポーネントとビジネスロジックの分離

#### 再利用性
- 共通コンポーネントの shared レイヤーでの管理
- Material-UI コンポーネントの活用

#### 型安全性
- TypeScript による静的型チェック
- 厳密な型定義によるバグの防止

## セキュリティ設計

### 認証・認可
- **JWT トークン** - ステートレス認証（将来実装予定）
- **ロールベースアクセス制御** - User.Role による権限管理
- **HTTPS 通信** - 通信の暗号化

### データ保護
- **入力値検証** - XSS、SQLインジェクション対策
- **CORS 設定** - 適切なオリジン制限
- **SQL パラメータ化** - Entity Framework Core による自動対応

## パフォーマンス設計

### バックエンド
- **非同期処理** - async/await パターンの活用
- **データベース最適化** - インデックス設計
- **キャッシュ戦略** - 将来的な Redis 導入検討

### フロントエンド
- **コード分割** - Vite による動的インポート
- **バンドル最適化** - 不要なライブラリの除外
- **画像最適化** - 適切な形式とサイズ

## 拡張性設計

### 水平スケーリング
- **ステートレス設計** - セッション状態の外部化
- **マイクロサービス対応** - 機能別分割の準備

### 垂直スケーリング
- **非同期処理** - バックグラウンドジョブ対応
- **データベース分散** - 読み書き分離の準備

## 監視・ログ設計

### ログ戦略
- **構造化ログ** - JSON 形式でのログ出力
- **ログレベル** - Info, Warning, Error の適切な使い分け
- **パフォーマンス監視** - API レスポンス時間の計測

### エラーハンドリング
- **統一エラー形式** - Result パターンによる一貫性
- **例外処理** - try-catch による適切な例外処理
- **ユーザーフレンドリーメッセージ** - 技術的詳細の隠蔽

## 品質保証

### テスト戦略
- **単体テスト** - xUnit による個別機能テスト（今後実装）
- **統合テスト** - API エンドポイントテスト（今後実装）
- **E2E テスト** - ユーザーシナリオテスト（今後実装）

### コード品質
- **静的解析** - ESLint による JavaScript/TypeScript 解析
- **コードレビュー** - GitHub Pull Request による相互レビュー
- **命名規約** - 一貫した命名ルールの適用

## 今後の拡張計画

### 短期目標
- **ユーザー認証機能** - JWT による認証システム
- **テストコード** - 包括的なテストスイート
- **API ドキュメント** - Swagger の充実

### 中期目標
- **リアルタイム機能** - SignalR による通知機能
- **レポート機能** - 学習進捗の可視化
- **モバイルアプリ** - React Native による対応

### 長期目標
- **AI 機能** - 学習推奨アルゴリズム
- **マルチテナント** - 組織別データ分離
- **国際化** - 多言語対応