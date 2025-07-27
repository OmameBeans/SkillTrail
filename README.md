# SkillTrail

## 概要

SkillTrailは、スキル習得のための学習管理システムです。個人や組織のスキル向上を体系的に管理し、進捗を追跡することができます。

## システム構成

### アーキテクチャ
本システムは以下の3層アーキテクチャで構成されています：

```
┌─────────────────┐
│   フロントエンド  │  React TypeScript (Vite)
├─────────────────┤
│   Web API       │  ASP.NET Core Web API
├─────────────────┤
│   データベース    │  SQL Server (Entity Framework Core)
└─────────────────┘
```

### 技術スタック

#### バックエンド
- **ASP.NET Core 8.0** - Web API フレームワーク
- **Entity Framework Core** - ORM
- **SQL Server** - データベース
- **Swagger** - API ドキュメント生成

#### フロントエンド
- **React 19** - UI ライブラリ
- **TypeScript** - 型安全な JavaScript
- **Material-UI (MUI)** - UI コンポーネントライブラリ
- **React Query** - データフェッチング管理
- **React Router** - ルーティング
- **Vite** - ビルドツール

## プロジェクト構造

```
src/
├── SkillTrail.Biz/          # ビジネスロジック層
│   ├── Entities/            # ドメインエンティティ
│   ├── ApplicationServices/ # アプリケーションサービス
│   ├── Interfaces/          # インターフェース定義
│   └── Extensions/          # 拡張メソッド
├── SkillTrail.Data/         # データアクセス層
│   ├── DbContexts/          # データベースコンテキスト
│   ├── Repositories/        # リポジトリ実装
│   └── Migrations/          # データベースマイグレーション
├── SkillTrail.Server/       # Web API層
│   ├── Controllers/         # API コントローラー
│   └── Program.cs           # アプリケーションエントリポイント
└── skilltrail.client/       # フロントエンドアプリケーション
    ├── src/
    │   ├── app/             # アプリケーション設定
    │   ├── entities/        # ドメインエンティティ（TypeScript）
    │   ├── features/        # 機能別コンポーネント
    │   ├── pages/           # ページコンポーネント
    │   └── shared/          # 共通コンポーネント
    └── public/              # 静的ファイル
```

## ドメインモデル

### 主要エンティティ

#### User（ユーザー）
- **役割**: システム利用者
- **属性**: 
  - 名前（Name）
  - ロール（Role）: None, Trainee, Admin
- **責務**: システムへのアクセス権限管理

#### TaskCategory（タスクカテゴリ）
- **役割**: タスクの階層的分類
- **属性**:
  - タイトル（Title）
  - 説明（Description）
  - 親カテゴリID（CategoryId）
  - 表示順序（Order）
- **責務**: タスクの体系的な整理

#### Task（タスク）
- **役割**: 個別の学習課題
- **属性**:
  - タイトル（Title）
  - 説明（Description）
  - カテゴリID（CategoryId）
  - 表示順序（Order）
- **責務**: 学習内容の定義

#### Progress（進捗）
- **役割**: ユーザーのタスク進捗追跡
- **属性**:
  - タスクID（TaskId）
  - ユーザーID（UserId）
  - ステータス（Status）: NotStarted, InProgress, Completed
- **責務**: 学習進捗の記録と管理

## 主要機能

### 管理機能
- タスク管理（作成・編集・削除・並び替え）
- カテゴリ管理（階層構造の管理）
- ユーザー管理（ロール設定）

### 学習機能
- タスク一覧表示
- 進捗状況確認
- カテゴリ別タスク表示

### システム機能
- ユーザー認証・認可
- API による CRUD 操作
- レスポンシブ UI

## セットアップ方法

### 前提条件
- .NET 8.0 SDK
- Node.js 20.x以上
- SQL Server または SQL Server Express

### 開発環境構築

1. **リポジトリのクローン**
   ```bash
   git clone https://github.com/OmameBeans/SkillTrail.git
   cd SkillTrail
   ```

2. **バックエンドのセットアップ**
   ```bash
   cd src
   dotnet restore
   dotnet build
   ```

3. **データベースのセットアップ**
   ```bash
   cd SkillTrail.Server
   dotnet ef database update
   ```

4. **フロントエンドのセットアップ**
   ```bash
   cd ../skilltrail.client
   npm install
   ```

5. **アプリケーションの実行**
   ```bash
   # バックエンド（別ターミナル）
   cd src
   dotnet run --project SkillTrail.Server
   
   # フロントエンド（別ターミナル）
   cd src/skilltrail.client
   npm run dev
   ```

## API エンドポイント

### Task API
- `GET /api/task/get` - 全タスク取得
- `GET /api/task/get/{id}` - 特定タスク取得
- `POST /api/task/getbycategory` - カテゴリ別タスク取得
- `POST /api/task/create` - タスク作成
- `POST /api/task/update` - タスク更新
- `POST /api/task/delete` - タスク削除
- `POST /api/task/reorder` - タスク並び替え

### TaskCategory API
- 基本的な CRUD 操作

### User API
- ユーザー管理機能

## 設計パターン

### Feature-Sliced Design (FSD)
フロントエンドは FSD アーキテクチャを採用し、以下の層で構成：
- **app**: アプリケーション初期化
- **pages**: ページレベルコンポーネント
- **features**: 機能単位のコンポーネント
- **entities**: ビジネスエンティティ
- **shared**: 共通コンポーネント

### Clean Architecture
バックエンドは Clean Architecture を採用：
- **Entities**: ドメインエンティティ
- **Use Cases**: アプリケーションサービス
- **Interface Adapters**: コントローラー・リポジトリ
- **Frameworks**: Web API・データベース

## 開発時の注意点

### コーディング規約
- C# は PascalCase
- TypeScript/JavaScript は camelCase
- ファイル名は PascalCase（コンポーネント）または camelCase（その他）

### データベース
- Entity Framework Core の Code First アプローチ
- マイグレーションによるスキーマ管理

### API 設計
- RESTful API の原則に従う
- 統一されたレスポンス形式（Result パターン）
- エラーハンドリングの統一

## 今後の拡張予定

- 学習進捗の可視化機能
- レポート機能
- 通知機能
- モバイル対応の向上
