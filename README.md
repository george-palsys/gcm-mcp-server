# ⚠️ DEPRECATED - GCM MCP Server (Custom Implementation)

> **This project has been deprecated in favor of the official IBM GCM MCP Server.**
> 
> **Please use:** https://github.com/IBM/gcm-mcp-server

---

## Why Deprecated?

IBM has released an official MCP Server for Guardium Cryptography Manager with:
- ✅ Official IBM support and maintenance
- ✅ Specialized cryptographic management features
- ✅ Post-quantum vulnerability detection
- ✅ Crypto Bill of Materials (CBOM) generation
- ✅ Enterprise-grade OAuth2 authentication
- ✅ Compliance and rotation management

## Migration Guide

### Old Configuration (This Repo - Node.js)
```json
{
  "mcpServers": {
    "gcm": {
      "command": "node",
      "args": ["C:/workspacce/gcm-mcp-server/src/index.js"],
      "env": {
        "GCM_URL": "https://10.107.85.165:31443",
        "GCM_KEYCLOAK_URL": "https://10.107.85.165:30443",
        "GCM_KEYCLOAK_REALM": "gcmrealm",
        "GCM_CLIENT_ID": "gcmclient",
        "GCM_CLIENT_SECRET": "your-secret",
        "GCM_USERNAME": "gcmadmin",
        "GCM_PASSWORD": "your-password"
      }
    }
  }
}
```

### New Configuration (IBM Official - Python)
```json
{
  "mcpServers": {
    "gcm": {
      "command": "python",
      "args": ["-m", "src.server", "--transport", "stdio"],
      "cwd": "C:/path/to/ibm-gcm-mcp-server",
      "env": {
        "GCM_HOST": "10.107.85.165",
        "GCM_API_PORT": "31443",
        "GCM_KEYCLOAK_PORT": "30443",
        "GCM_USERNAME": "gcmadmin",
        "GCM_PASSWORD": "your-password",
        "GCM_CLIENT_ID": "gcmclient",
        "GCM_CLIENT_SECRET": "your-secret",
        "GCM_VERIFY_SSL": "false",
        "GCM_AUTH_MODE": "auto"
      }
    }
  }
}
```

## Installation (IBM Official Version)

```bash
# Clone the official repository
git clone https://github.com/IBM/gcm-mcp-server.git
cd gcm-mcp-server

# Install Python dependencies
pip install mcp starlette uvicorn requests python-dotenv

# Create .env file
cat > .env << EOF
GCM_HOST=your-gcm-host
GCM_API_PORT=31443
GCM_KEYCLOAK_PORT=30443
GCM_USERNAME=your-username
GCM_PASSWORD=your-password
GCM_CLIENT_ID=gcmclient
GCM_CLIENT_SECRET=your-client-secret
GCM_VERIFY_SSL=false
GCM_AUTH_MODE=auto
EOF

# Test the server
python -m src.server --transport stdio
```

## Key Differences

| Feature | Custom (This Repo) | IBM Official |
|---------|-------------------|--------------|
| Language | Node.js | Python |
| Tools | 26 specific tools | 3 flexible tools |
| Maintenance | Community | IBM Official |
| Features | Basic API access | Advanced crypto management |
| Authentication | Manual OAuth2 | Auto OAuth2 + Session |
| Quantum Detection | ❌ | ✅ |
| CBOM Generation | ❌ | ✅ |

## Tools Comparison

### Custom Implementation (26 Tools)
- list_certificates, get_certificate, create_certificate, revoke_certificate
- list_policies, get_policy
- list_policy_violations, get_policy_violation, acknowledge_violation
- list_it_assets, get_it_asset, count_it_assets
- list_crypto_objects, get_crypto_object, create_crypto_key
- list_vaults, get_vault, create_vault
- run_crypto_discovery, get_discovery_results
- get_crypto_inventory, get_compliance_report, get_risk_assessment
- get_audit_logs, search_audit_logs

### IBM Official (3 Flexible Tools)
- **gcm_auth** - Authentication with auto-login
- **gcm_api** - Universal API caller (supports all endpoints)
- **gcm_discover** - Service discovery and API exploration

## Historical Context

This repository was created as a custom Node.js implementation before IBM released their official Python-based MCP Server. It served as a proof-of-concept and learning project.

**Status:** Archived for reference only. No further updates planned.

**Recommendation:** Use the official IBM version for production workloads.

---

## Original Documentation (For Reference)

<details>
<summary>Click to expand original README</summary>

# GCM MCP Server (Original)

IBM Guardium Cryptography Manager (GCM) MCP Server - 提供標準 MCP 協議介面來存取 GCM 的 26 個管理工具。

[Original documentation content preserved below...]

</details>

---

**Last Updated:** 2026-05-06  
**Deprecated Since:** 2026-05-06  
**Maintained By:** IBM (Official Version)