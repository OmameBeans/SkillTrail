# 開発ガイド

## 開発環境のセットアップ

### 必要なツール

#### 必須
- **Visual Studio 2022** または **Visual Studio Code**
- **.NET 8.0 SDK**
- **Node.js 20.x以上**
- **SQL Server Express** または **SQL Server**

#### 推奨
- **SQL Server Management Studio (SSMS)**
- **Postman** または **Insomnia**（API テスト用）

### プロジェクトの起動手順

1. **ソリューションファイルを開く**
   ```
   src/SkillTrail.sln
   ```

2. **NuGet パッケージの復元**
   ```bash
   dotnet restore
   ```

3. **データベース接続文字列の設定**
   `src/SkillTrail.Server/appsettings.Development.json` を編集:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=SkillTrailDb;Trusted_Connection=true;MultipleActiveResultSets=true"
     }
   }
   ```

4. **データベースマイグレーションの実行**
   ```bash
   cd src/SkillTrail.Server
   dotnet ef database update
   ```

5. **フロントエンドの依存関係インストール**
   ```bash
   cd ../skilltrail.client
   npm install
   ```

## 開発サーバーの起動

### 方法1: Visual Studio から起動
1. Visual Studio でソリューションを開く
2. 複数のスタートアッププロジェクトを設定:
   - `SkillTrail.Server`
   - `skilltrail.client`
3. F5 キーで起動

### 方法2: コマンドラインから起動
```bash
# ターミナル1: バックエンド
cd src/SkillTrail.Server
dotnet run

# ターミナル2: フロントエンド
cd src/skilltrail.client
npm run dev
```

### アクセス先
- **フロントエンド**: http://localhost:5173
- **バックエンド API**: https://localhost:7154
- **Swagger UI**: https://localhost:7154/swagger

## データベース操作

### マイグレーションの作成
```bash
cd src/SkillTrail.Data
dotnet ef migrations add <MigrationName> --startup-project ../SkillTrail.Server
```

### マイグレーションの適用
```bash
cd src/SkillTrail.Server
dotnet ef database update
```

### データベースの初期化
```bash
cd src/SkillTrail.Server
dotnet ef database drop
dotnet ef database update
```

## 開発時のワークフロー

### 新機能の追加手順

1. **エンティティの追加**（必要に応じて）
   - `src/SkillTrail.Biz/Entities/` にエンティティクラスを追加
   - DbContext にエンティティを登録

2. **リポジトリの実装**
   - `src/SkillTrail.Biz/Interfaces/` にインターフェースを定義
   - `src/SkillTrail.Data/Repositories/` に実装クラスを作成

3. **アプリケーションサービスの実装**
   - `src/SkillTrail.Biz/ApplicationServices/` にサービスクラスを作成

4. **コントローラーの実装**
   - `src/SkillTrail.Server/Controllers/` にコントローラーを作成

5. **フロントエンドの実装**
   - Entity モデルの定義
   - API クライアントの実装
   - UI コンポーネントの作成

### コードスタイル

#### C# (.NET)
- PascalCase を使用
- async/await パターンの活用
- nullable reference types の有効化

#### TypeScript/React
- camelCase を使用
- 関数コンポーネントを優先
- TypeScript の型安全性を活用

## トラブルシューティング

### よくある問題

#### 1. データベース接続エラー
**症状**: 「Cannot open database」エラー
**解決方法**: 
- SQL Server サービスが起動していることを確認
- 接続文字列が正しいことを確認

#### 2. npm install エラー
**症状**: パッケージインストールに失敗
**解決方法**: 
```bash
cd src/skilltrail.client
rm -rf node_modules package-lock.json
npm install
```

#### 3. ポートの競合
**症状**: 「Address already in use」エラー
**解決方法**: 
- タスクマネージャーでプロセスを終了
- 別のポートを使用するよう設定を変更

#### 4. CORS エラー
**症状**: ブラウザコンソールで CORS エラー
**解決方法**: 
- `Program.cs` の CORS 設定を確認
- 開発環境での CORS 許可設定

### デバッグ方法

#### バックエンド
- Visual Studio のブレークポイント機能を使用
- ログ出力による状態確認
- Swagger UI での API テスト

#### フロントエンド
- ブラウザの開発者ツールを使用
- React Developer Tools の活用
- Network タブでの API 通信確認

## テスト

### 単体テスト
現在テストプロジェクトは未実装ですが、以下の方針で追加予定：
- xUnit を使用した単体テスト
- Moq を使用したモック
- React Testing Library を使用したフロントエンドテスト

### 手動テスト
1. API エンドポイントのテスト（Postman/Swagger）
2. UI 機能のテスト（ブラウザ）
3. データ整合性のテスト（データベース）

## デプロイ

### 本番環境へのデプロイ準備
1. **設定ファイルの更新**
   - 接続文字列の本番環境用への変更
   - セキュリティ設定の確認

2. **ビルド**
   ```bash
   dotnet publish --configuration Release
   npm run build
   ```

3. **データベースマイグレーション**
   ```bash
   dotnet ef database update --configuration Release
   ```

## 参考資料

- [ASP.NET Core ドキュメント](https://docs.microsoft.com/aspnet/core/)
- [Entity Framework Core ドキュメント](https://docs.microsoft.com/ef/core/)
- [React ドキュメント](https://reactjs.org/docs/)
- [Material-UI ドキュメント](https://mui.com/)
- [Feature-Sliced Design](https://feature-sliced.design/)