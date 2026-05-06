# GCM MCP Server

IBM Guardium Cryptography Manager (GCM) MCP Server - 提供標準 MCP 協議介面來存取 GCM 的 26 個管理工具。

## 功能特色

- ✅ **26 個 GCM 工具**：完整的證書、政策、資產、加密物件管理
- 🔐 **OAuth2 認證**：自動處理 Keycloak 雙步驟認證流程
- 🔄 **自動令牌更新**：智能管理存取令牌生命週期
- 🛠️ **標準 MCP 協議**：與任何支援 MCP 的 AI 助手整合
- 📊 **完整 API 覆蓋**：支援所有 GCM REST API 端點

## 支援的工具類別

### 證書管理 (4 個工具)
- `list_certificates` - 列出所有證書
- `get_certificate` - 取得證書詳細資訊
- `create_certificate` - 建立新證書
- `revoke_certificate` - 撤銷證書

### 政策管理 (5 個工具)
- `list_policies` - 列出所有政策
- `get_policy` - 取得政策詳細資訊
- `list_policy_violations` - 列出政策違規
- `get_policy_violation` - 取得違規詳細資訊
- `acknowledge_violation` - 確認違規

### IT 資產管理 (3 個工具)
- `list_it_assets` - 列出所有 IT 資產
- `get_it_asset` - 取得資產詳細資訊
- `count_it_assets` - 統計資產數量

### 加密物件管理 (3 個工具)
- `list_crypto_objects` - 列出加密物件
- `get_crypto_object` - 取得物件詳細資訊
- `create_crypto_key` - 建立加密金鑰

### 保管庫管理 (3 個工具)
- `list_vaults` - 列出所有保管庫
- `get_vault` - 取得保管庫詳細資訊
- `create_vault` - 建立新保管庫

### 探索與清單 (3 個工具)
- `run_crypto_discovery` - 執行加密探索掃描
- `get_discovery_results` - 取得掃描結果
- `get_crypto_inventory` - 取得加密清單報告

### 合規與報告 (2 個工具)
- `get_compliance_report` - 產生合規報告
- `get_risk_assessment` - 取得風險評估

### 稽核與日誌 (2 個工具)
- `get_audit_logs` - 取得稽核日誌
- `search_audit_logs` - 搜尋稽核日誌

## 安裝

### 前置需求

- Node.js 18.0.0 或更高版本
- 可存取的 GCM 伺服器
- Keycloak 認證伺服器
- 有效的 GCM 使用者憑證

### 步驟

1. **複製專案**
```bash
cd gcm-mcp-server
```

2. **安裝相依套件**
```bash
npm install
```

3. **設定環境變數**

複製 `.env.example` 為 `.env` 並填入您的設定：

```bash
cp .env.example .env
```

編輯 `.env` 檔案：

```env
GCM_KEYCLOAK_URL=https://your-keycloak-server.com/auth
GCM_KEYCLOAK_REALM=guardium
GCM_CLIENT_ID=your-client-id
GCM_CLIENT_SECRET=your-client-secret
GCM_URL=https://your-gcm-server.com
GCM_USERNAME=your-username
GCM_PASSWORD=your-password
```

## 使用方式

### 方式 1：獨立執行

直接執行 MCP 伺服器：

```bash
npm start
```

### 方式 2：與 Bob Shell 整合

1. **複製 Bob Shell 設定範例**

將 `bob-shell-config.json` 的內容加入到您的 Bob Shell 設定檔：

- 專案設定：`.bob/settings.json`
- 使用者設定：`~/.bob/settings.json`

2. **更新設定檔路徑和憑證**

```json
{
  "mcpServers": {
    "gcm": {
      "command": "node",
      "args": ["C:/workspacce/gcm-mcp-server/src/index.js"],
      "env": {
        "GCM_KEYCLOAK_URL": "https://your-keycloak-server.com/auth",
        "GCM_KEYCLOAK_REALM": "guardium",
        "GCM_CLIENT_ID": "your-client-id",
        "GCM_CLIENT_SECRET": "your-client-secret",
        "GCM_URL": "https://your-gcm-server.com",
        "GCM_USERNAME": "your-username",
        "GCM_PASSWORD": "your-password"
      },
      "timeout": 30000,
      "trust": false
    }
  }
}
```

3. **啟動 Bob Shell**

```bash
bob
```

Bob Shell 會自動連接到 GCM MCP 伺服器並載入所有 26 個工具。

### 方式 3：使用環境變數（推薦用於生產環境）

為了安全性，建議使用環境變數而非在設定檔中硬編碼憑證：

```json
{
  "mcpServers": {
    "gcm": {
      "command": "node",
      "args": ["C:/workspacce/gcm-mcp-server/src/index.js"],
      "env": {
        "GCM_KEYCLOAK_URL": "$GCM_KEYCLOAK_URL",
        "GCM_KEYCLOAK_REALM": "$GCM_KEYCLOAK_REALM",
        "GCM_CLIENT_ID": "$GCM_CLIENT_ID",
        "GCM_CLIENT_SECRET": "$GCM_CLIENT_SECRET",
        "GCM_URL": "$GCM_URL",
        "GCM_USERNAME": "$GCM_USERNAME",
        "GCM_PASSWORD": "$GCM_PASSWORD"
      }
    }
  }
}
```

## 使用範例

### 範例 1：列出即將到期的證書

```
請列出 30 天內即將到期的證書
```

Bob Shell 會使用 `list_certificates` 工具：
```json
{
  "status": "expiring_soon",
  "days_until_expiry": 30
}
```

### 範例 2：統計 IT 資產

```
有多少個 IT 資產？
```

Bob Shell 會使用 `count_it_assets` 工具。

### 範例 3：查詢政策違規

```
列出所有嚴重等級的政策違規
```

Bob Shell 會使用 `list_policy_violations` 工具：
```json
{
  "severity": "critical",
  "status": "open"
}
```

### 範例 4：產生合規報告

```
產生 PCI-DSS 合規報告
```

Bob Shell 會使用 `get_compliance_report` 工具：
```json
{
  "standard": "PCI-DSS",
  "format": "json"
}
```

## 架構說明

```
gcm-mcp-server/
├── src/
│   ├── index.js          # MCP 伺服器主程式
│   ├── auth.js           # OAuth2 認證客戶端
│   └── tools.js          # GCM 工具定義
├── .env.example          # 環境變數範例
├── bob-shell-config.json # Bob Shell 設定範例
├── package.json          # 專案設定
└── README.md            # 本文件
```

### 認證流程

1. **取得 Keycloak 令牌**
   - 使用使用者憑證向 Keycloak 請求存取令牌
   - 令牌有效期通常為 5-15 分鐘

2. **GCM 授權**
   - 使用 Keycloak 令牌向 GCM 用戶管理端點授權
   - 取得 GCM API 存取權限

3. **自動更新**
   - 伺服器自動追蹤令牌到期時間
   - 在令牌到期前自動更新

## 疑難排解

### 認證失敗

**錯誤：** `Keycloak authentication failed`

**解決方案：**
- 確認 Keycloak URL 和 Realm 正確
- 驗證 Client ID 和 Secret
- 檢查使用者憑證是否有效

### 連接失敗

**錯誤：** `GCM API request failed`

**解決方案：**
- 確認 GCM URL 可存取
- 檢查網路連線
- 驗證防火牆設定

### 工具執行失敗

**錯誤：** `Unknown tool: xxx`

**解決方案：**
- 確認工具名稱拼寫正確
- 檢查 MCP 伺服器是否正確啟動
- 查看伺服器日誌以取得詳細錯誤訊息

### Bob Shell 無法連接

**解決方案：**
1. 確認 `bob-shell-config.json` 中的路徑正確
2. 檢查 Node.js 是否已安裝且在 PATH 中
3. 驗證所有環境變數都已設定
4. 重新啟動 Bob Shell

## 安全性考量

- ⚠️ **不要將憑證提交到版本控制系統**
- 🔒 使用環境變數或安全的密鑰管理系統
- 🔐 定期輪換密碼和 Client Secret
- 📝 限制 GCM 使用者權限為最小必要權限
- 🛡️ 在生產環境中使用 HTTPS

## 授權

Apache License 2.0

## 支援

如有問題或需要協助，請聯繫：
- IBM 內部支援團隊
- GCM 產品團隊
- Bob Shell 開發團隊

## 相關資源

- [IBM Guardium Cryptography Manager 文檔](https://www.ibm.com/docs/en/guardium-cm)
- [Model Context Protocol 規範](https://modelcontextprotocol.io)
- [Bob Shell 文檔](內部連結)
