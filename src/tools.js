/**
 * GCM MCP Tools Definitions
 * Based on IBM Guardium Cryptography Manager API v2.0.1.0
 * Updated with correct API endpoints from Swagger documentation
 */

export const GCM_TOOLS = [
  // Certificate Management Tools
  {
    name: "list_certificates",
    description: "List all certificates in GCM with optional filtering",
    inputSchema: {
      type: "object",
      properties: {
        status: {
          type: "string",
          description: "Filter by certificate status (active, expired, expiring_soon)",
          enum: ["active", "expired", "expiring_soon", "all"]
        },
        days_until_expiry: {
          type: "number",
          description: "Filter certificates expiring within specified days"
        },
        limit: {
          type: "number",
          description: "Maximum number of results to return",
          default: 100
        }
      }
    }
  },
  {
    name: "get_certificate",
    description: "Get detailed information about a specific certificate",
    inputSchema: {
      type: "object",
      properties: {
        certificate_id: {
          type: "string",
          description: "The unique identifier of the certificate"
        }
      },
      required: ["certificate_id"]
    }
  },
  {
    name: "create_certificate",
    description: "Create a new certificate in GCM",
    inputSchema: {
      type: "object",
      properties: {
        common_name: {
          type: "string",
          description: "Common name for the certificate"
        },
        validity_days: {
          type: "number",
          description: "Number of days the certificate is valid"
        },
        key_size: {
          type: "number",
          description: "Key size in bits (2048, 4096)",
          enum: [2048, 4096]
        }
      },
      required: ["common_name", "validity_days"]
    }
  },
  {
    name: "revoke_certificate",
    description: "Revoke a certificate",
    inputSchema: {
      type: "object",
      properties: {
        certificate_id: {
          type: "string",
          description: "The unique identifier of the certificate to revoke"
        },
        reason: {
          type: "string",
          description: "Reason for revocation"
        }
      },
      required: ["certificate_id"]
    }
  },

  // Policy Management Tools
  {
    name: "list_policies",
    description: "List all cryptographic policies",
    inputSchema: {
      type: "object",
      properties: {
        type: {
          type: "string",
          description: "Filter by policy type",
          enum: ["encryption", "key_management", "certificate", "all"]
        }
      }
    }
  },
  {
    name: "get_policy",
    description: "Get detailed information about a specific policy",
    inputSchema: {
      type: "object",
      properties: {
        policy_id: {
          type: "string",
          description: "The unique identifier of the policy"
        }
      },
      required: ["policy_id"]
    }
  },
  {
    name: "list_policy_violations",
    description: "List all policy violations",
    inputSchema: {
      type: "object",
      properties: {
        severity: {
          type: "string",
          description: "Filter by severity level",
          enum: ["critical", "high", "medium", "low", "all"]
        },
        status: {
          type: "string",
          description: "Filter by violation status",
          enum: ["open", "resolved", "acknowledged", "all"]
        },
        limit: {
          type: "number",
          description: "Maximum number of results",
          default: 100
        }
      }
    }
  },
  {
    name: "get_policy_violation",
    description: "Get detailed information about a specific policy violation",
    inputSchema: {
      type: "object",
      properties: {
        violation_id: {
          type: "string",
          description: "The unique identifier of the violation"
        }
      },
      required: ["violation_id"]
    }
  },
  {
    name: "acknowledge_violation",
    description: "Acknowledge a policy violation",
    inputSchema: {
      type: "object",
      properties: {
        violation_id: {
          type: "string",
          description: "The unique identifier of the violation"
        },
        comment: {
          type: "string",
          description: "Comment about the acknowledgment"
        }
      },
      required: ["violation_id"]
    }
  },

  // IT Asset Management Tools
  {
    name: "list_it_assets",
    description: "List all IT assets monitored by GCM",
    inputSchema: {
      type: "object",
      properties: {
        asset_type: {
          type: "string",
          description: "Filter by asset type",
          enum: ["server", "application", "database", "network_device", "all"]
        },
        status: {
          type: "string",
          description: "Filter by asset status",
          enum: ["active", "inactive", "all"]
        }
      }
    }
  },
  {
    name: "get_it_asset",
    description: "Get detailed information about a specific IT asset",
    inputSchema: {
      type: "object",
      properties: {
        asset_id: {
          type: "string",
          description: "The unique identifier of the asset"
        }
      },
      required: ["asset_id"]
    }
  },
  {
    name: "count_it_assets",
    description: "Get the total count of IT assets",
    inputSchema: {
      type: "object",
      properties: {
        asset_type: {
          type: "string",
          description: "Count assets of specific type",
          enum: ["server", "application", "database", "network_device", "all"]
        }
      }
    }
  },

  // Cryptographic Object Management Tools
  {
    name: "list_crypto_objects",
    description: "List all cryptographic objects (keys, certificates, etc.)",
    inputSchema: {
      type: "object",
      properties: {
        object_type: {
          type: "string",
          description: "Filter by object type",
          enum: ["key", "certificate", "secret", "all"]
        },
        algorithm: {
          type: "string",
          description: "Filter by cryptographic algorithm"
        }
      }
    }
  },
  {
    name: "get_crypto_object",
    description: "Get detailed information about a specific cryptographic object",
    inputSchema: {
      type: "object",
      properties: {
        object_id: {
          type: "string",
          description: "The unique identifier of the cryptographic object"
        }
      },
      required: ["object_id"]
    }
  },
  {
    name: "create_crypto_key",
    description: "Create a new cryptographic key",
    inputSchema: {
      type: "object",
      properties: {
        key_name: {
          type: "string",
          description: "Name for the key"
        },
        algorithm: {
          type: "string",
          description: "Cryptographic algorithm",
          enum: ["AES", "RSA", "ECC"]
        },
        key_size: {
          type: "number",
          description: "Key size in bits"
        }
      },
      required: ["key_name", "algorithm", "key_size"]
    }
  },

  // Vault Management Tools
  {
    name: "list_vaults",
    description: "List all cryptographic vaults",
    inputSchema: {
      type: "object",
      properties: {
        status: {
          type: "string",
          description: "Filter by vault status",
          enum: ["active", "inactive", "all"]
        }
      }
    }
  },
  {
    name: "get_vault",
    description: "Get detailed information about a specific vault",
    inputSchema: {
      type: "object",
      properties: {
        vault_id: {
          type: "string",
          description: "The unique identifier of the vault"
        }
      },
      required: ["vault_id"]
    }
  },
  {
    name: "create_vault",
    description: "Create a new cryptographic vault",
    inputSchema: {
      type: "object",
      properties: {
        vault_name: {
          type: "string",
          description: "Name for the vault"
        },
        description: {
          type: "string",
          description: "Description of the vault"
        }
      },
      required: ["vault_name"]
    }
  },

  // Discovery and Inventory Tools
  {
    name: "run_crypto_discovery",
    description: "Run cryptographic discovery scan on specified assets",
    inputSchema: {
      type: "object",
      properties: {
        asset_ids: {
          type: "array",
          items: { type: "string" },
          description: "List of asset IDs to scan"
        },
        scan_type: {
          type: "string",
          description: "Type of discovery scan",
          enum: ["full", "quick", "targeted"]
        }
      },
      required: ["asset_ids"]
    }
  },
  {
    name: "get_discovery_results",
    description: "Get results from a cryptographic discovery scan",
    inputSchema: {
      type: "object",
      properties: {
        scan_id: {
          type: "string",
          description: "The unique identifier of the scan"
        }
      },
      required: ["scan_id"]
    }
  },
  {
    name: "get_crypto_inventory",
    description: "Get comprehensive cryptographic inventory report",
    inputSchema: {
      type: "object",
      properties: {
        format: {
          type: "string",
          description: "Report format",
          enum: ["json", "csv", "pdf"],
          default: "json"
        },
        include_details: {
          type: "boolean",
          description: "Include detailed information",
          default: false
        }
      }
    }
  },

  // Compliance and Reporting Tools
  {
    name: "get_compliance_report",
    description: "Generate compliance report for specified standards",
    inputSchema: {
      type: "object",
      properties: {
        standard: {
          type: "string",
          description: "Compliance standard",
          enum: ["PCI-DSS", "HIPAA", "GDPR", "SOC2", "all"]
        },
        format: {
          type: "string",
          description: "Report format",
          enum: ["json", "pdf"],
          default: "json"
        }
      }
    }
  },
  {
    name: "get_risk_assessment",
    description: "Get cryptographic risk assessment report",
    inputSchema: {
      type: "object",
      properties: {
        scope: {
          type: "string",
          description: "Assessment scope",
          enum: ["organization", "department", "asset_group"]
        },
        risk_level: {
          type: "string",
          description: "Filter by risk level",
          enum: ["critical", "high", "medium", "low", "all"]
        }
      }
    }
  },

  // Audit and Logging Tools
  {
    name: "get_audit_logs",
    description: "Retrieve audit logs for cryptographic operations",
    inputSchema: {
      type: "object",
      properties: {
        start_date: {
          type: "string",
          description: "Start date for log retrieval (ISO 8601 format)"
        },
        end_date: {
          type: "string",
          description: "End date for log retrieval (ISO 8601 format)"
        },
        event_type: {
          type: "string",
          description: "Filter by event type"
        },
        limit: {
          type: "number",
          description: "Maximum number of log entries",
          default: 1000
        }
      }
    }
  },
  {
    name: "search_audit_logs",
    description: "Search audit logs with advanced filters",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query string"
        },
        filters: {
          type: "object",
          description: "Additional filters for the search"
        }
      },
      required: ["query"]
    }
  }
];

/**
 * Map tool names to GCM API endpoints
 * Updated based on Swagger API documentation (181 endpoints)
 * Base URL: https://10.107.85.165:31443
 * 
 * Key patterns:
 * - Most list operations use POST with request body containing filters and pagination
 * - Asset-related endpoints use pattern: /api/v1/assets/{asset_category}/{asset_type}
 * - Certificate operations use: /api/v1/certificate/*
 * - Dashboard endpoints: /api/v1/dashboard/*
 */
export const TOOL_ENDPOINT_MAP = {
  // Certificates - Using actual GCM API paths
  "list_certificates": { method: "POST", path: "/api/v1/assets/{asset_category}/{asset_type}" },
  "get_certificate": { method: "GET", path: "/api/v1/certificate/get-cert-details" },
  "create_certificate": { method: "POST", path: "/api/v1/certificate/selfSigned" },
  "revoke_certificate": { method: "DELETE", path: "/api/v1/certificate/delete" },
  
  // Policies - Using actual GCM API paths
  "list_policies": { method: "POST", path: "/api/v1/assets/{asset_category}/{asset_type}" },
  "get_policy": { method: "GET", path: "/api/v1/policies/{policy_id}" },
  "list_policy_violations": { method: "POST", path: "/api/v1/assets/{asset_category}/{asset_type}" },
  "get_policy_violation": { method: "GET", path: "/api/v1/violations/{violation_id}" },
  "acknowledge_violation": { method: "POST", path: "/api/v1/violations/{violation_id}/acknowledge" },
  
  // IT Assets - Using actual GCM API paths with POST method
  "list_it_assets": { method: "POST", path: "/api/v1/assets/{asset_category}/{asset_type}" },
  "get_it_asset": { method: "POST", path: "/api/v1/assets/details/{asset_category}" },
  "count_it_assets": { method: "GET", path: "/api/v1/assets/count/vulnerable_crypto_objects" },
  
  // Crypto Objects - Using actual GCM API paths
  "list_crypto_objects": { method: "POST", path: "/api/v1/assets/{asset_category}/{asset_type}" },
  "get_crypto_object": { method: "POST", path: "/api/v1/assets/details/crypto_objects/{asset_type}" },
  "create_crypto_key": { method: "POST", path: "/api/v1/symmetric-key/{uuid}" },
  
  // Vaults - Using actual GCM API paths
  "list_vaults": { method: "GET", path: "/api/v1/certificate/vault-details" },
  "get_vault": { method: "GET", path: "/api/v1/certificate/vault-details" },
  "create_vault": { method: "POST", path: "/api/v1/certificate/vault-details" },
  
  // Discovery - Using actual GCM API paths
  "run_crypto_discovery": { method: "POST", path: "/api/v1/discovery/profiles/{id}/action/run" },
  "get_discovery_results": { method: "GET", path: "/api/v1/discovery/runs/{run_id}" },
  "get_crypto_inventory": { method: "POST", path: "/api/v1/assets/{asset_category}/{asset_type}" },
  
  // Compliance - Using actual GCM API paths
  "get_compliance_report": { method: "GET", path: "/api/v1/dashboard/compliance-posture" },
  "get_risk_assessment": { method: "GET", path: "/api/v1/dashboard/crypto-posture" },
  
  // Audit - Using actual GCM API paths
  "get_audit_logs": { method: "GET", path: "/api/v1/audits" },
  "search_audit_logs": { method: "GET", path: "/api/v1/audits/{auditId}" }
};
