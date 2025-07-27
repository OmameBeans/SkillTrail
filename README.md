# SkillTrail

## 概要

SkillTrailは、タスク管理を行うWebアプリケーションです。ユーザーは複数のタスクカテゴリに分類されたタスクを管理し、その進捗を追跡することができます。管理者機能により、研修プログラムの管理や受講者の進捗監視も可能です。

## アーキテクチャ

このプロジェクトは以下の4つの主要コンポーネントで構成されています：

### バックエンド（.NET Core）
- **SkillTrail.Server** - ASP.NET Core Web API サーバー
- **SkillTrail.Biz** - ビジネスロジック層
- **SkillTrail.Data** - データアクセス層（Entity Framework Core）

### フロントエンド（React + TypeScript）
- **skilltrail.client** - React + TypeScript + Vite による SPA

## 主要機能

### エンティティ
- **User** - ユーザー管理（研修生、管理者）
- **TaskCategory** - タスクカテゴリ管理
- **Task** - 個別タスク管理
- **Progress** - ユーザーのタスク進捗状況

### 機能一覧
- ✅ ユーザー管理（研修生・管理者権限）
- ✅ タスクカテゴリの階層管理
- ✅ タスクの作成・編集・削除
- ✅ 進捗状況の追跡（未開始・進行中・完了）
- ✅ 管理者向けダッシュボード
- ✅ 研修プログラム管理

## 技術スタック

### バックエンド
- **フレームワーク**: ASP.NET Core 8.0
- **データベース**: Entity Framework Core
- **API**: RESTful Web API
- **認証**: ASP.NET Core Identity（実装予定）

### フロントエンド
- **フレームワーク**: React 19.1
- **言語**: TypeScript 5.8
- **ビルドツール**: Vite
- **UI フレームワーク**: Material-UI (MUI)
- **状態管理**: TanStack Query
- **ルーティング**: React Router DOM
- **通知**: Notistack
- **ドラッグ&ドロップ**: @dnd-kit

## プロジェクト構造

```
src/
├── SkillTrail.Server/          # Web API サーバー
│   ├── Controllers/            # API コントローラー
│   ├── Program.cs             # アプリケーションエントリポイント
│   └── UserContextAdapter.cs  # ユーザーコンテキスト実装
├── SkillTrail.Biz/            # ビジネスロジック層
│   ├── Entities/              # ドメインエンティティ
│   ├── ApplicationServices/    # アプリケーションサービス
│   ├── Interfaces/            # インターフェース定義
│   └── Extensions/            # 拡張メソッド
├── SkillTrail.Data/           # データアクセス層
│   ├── DbContexts/            # Entity Framework DbContext
│   ├── Repositories/          # リポジトリパターン実装
│   └── Migrations/            # データベースマイグレーション
└── skilltrail.client/         # React フロントエンド
    ├── src/
    │   ├── app/               # アプリケーション設定
    │   ├── features/          # 機能別コンポーネント
    │   ├── pages/             # ページコンポーネント
    │   ├── entities/          # エンティティ型定義
    │   └── shared/            # 共通コンポーネント
    └── public/                # 静的ファイル
```

## セットアップ手順

### 前提条件
- .NET 8.0 SDK
- Node.js 18+ 
- Visual Studio 2022 または VS Code

### インストール

1. **リポジトリのクローン**
   ```bash
   git clone [repository-url]
   cd SkillTrail
   ```

2. **バックエンドの復元**
   ```bash
   cd src
   dotnet restore
   ```

3. **フロントエンドの依存関係インストール**
   ```bash
   cd skilltrail.client
   npm install
   ```

4. **データベースの設定**
   ```bash
   cd ../SkillTrail.Data
   dotnet ef database update
   ```

## 実行方法

### 開発環境

1. **Visual Studio で実行**
   - `SkillTrail.sln` を開く
   - スタートアッププロジェクトを `SkillTrail.Server` に設定
   - F5 キーで実行

2. **個別実行**
   
   **バックエンド（API サーバー）**
   ```bash
   cd src/SkillTrail.Server
   dotnet run
   ```
   API は `https://localhost:7065` で利用可能

   **フロントエンド（開発サーバー）**
   ```bash
   cd src/skilltrail.client
   npm run dev
   ```
   アプリケーションは `http://localhost:5173` で利用可能

### プロダクション

```bash
# フロントエンドビルド
cd src/skilltrail.client
npm run build

# API サーバー実行
cd ../SkillTrail.Server
dotnet run --configuration Release
```

## API エンドポイント

### Task API
- `GET /api/Task/Get` - 全タスク取得
- `GET /api/Task/Get/{id}` - 特定タスク取得
- `POST /api/Task/GetByCategory` - カテゴリ別タスク取得
- `POST /api/Task/Create` - タスク作成
- `POST /api/Task/Update` - タスク更新
- `DELETE /api/Task/Delete/{id}` - タスク削除

### TaskCategory API
- `GET /api/TaskCategory/Get` - 全カテゴリ取得
- `POST /api/TaskCategory/Create` - カテゴリ作成
- `POST /api/TaskCategory/Update` - カテゴリ更新

### User API
- `GET /api/User/Get` - 全ユーザー取得
- `POST /api/User/Create` - ユーザー作成
