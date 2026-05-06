/**
 * Mock GCM Data for Testing
 * Based on actual scan results from QSE
 */

export const MOCK_IT_ASSETS = {
  total: 10,
  assets: [
    {
      id: "asset-001",
      name: "DashboardController.java",
      type: "application",
      path: "src\\main\\java\\org\\hdivsamples\\controllers\\DashboardController.java",
      status: "active",
      crypto_functions: 11,
      last_scan: "2026-05-06T15:24:16Z"
    },
    {
      id: "asset-002",
      name: "guava-15.0.jar",
      type: "application",
      path: "target/dependency/guava-15.0.jar",
      status: "active",
      crypto_functions: 3,
      last_scan: "2026-05-06T15:24:07Z"
    },
    {
      id: "asset-003",
      name: "hsqldb-2.3.4.jar",
      type: "database",
      path: "target/dependency/hsqldb-2.3.4.jar",
      status: "active",
      crypto_functions: 10,
      last_scan: "2026-05-06T15:24:07Z"
    },
    {
      id: "asset-004",
      name: "log4j-core-2.14.1.jar",
      type: "application",
      path: "target/dependency/log4j-core-2.14.1.jar",
      status: "active",
      crypto_functions: 7,
      last_scan: "2026-05-06T15:24:07Z"
    },
    {
      id: "asset-005",
      name: "postgresql-9.2-1004-jdbc4.jar",
      type: "database",
      path: "target/dependency/postgresql-9.2-1004-jdbc4.jar",
      status: "active",
      crypto_functions: 17,
      last_scan: "2026-05-06T15:24:07Z"
    },
    {
      id: "asset-006",
      name: "spring-core-4.2.3.RELEASE.jar",
      type: "application",
      path: "target/dependency/spring-core-4.2.3.RELEASE.jar",
      status: "active",
      crypto_functions: 5,
      last_scan: "2026-05-06T15:24:07Z"
    },
    {
      id: "asset-007",
      name: "spring-security-config-4.0.3.RELEASE.jar",
      type: "application",
      path: "target/dependency/spring-security-config-4.0.3.RELEASE.jar",
      status: "active",
      crypto_functions: 2,
      last_scan: "2026-05-06T15:24:07Z"
    },
    {
      id: "asset-008",
      name: "spring-security-core-4.0.3.RELEASE.jar",
      type: "application",
      path: "target/dependency/spring-security-core-4.0.3.RELEASE.jar",
      status: "active",
      crypto_functions: 18,
      last_scan: "2026-05-06T15:24:07Z"
    },
    {
      id: "asset-009",
      name: "spring-security-web-4.0.3.RELEASE.jar",
      type: "application",
      path: "target/dependency/spring-security-web-4.0.3.RELEASE.jar",
      status: "active",
      crypto_functions: 4,
      last_scan: "2026-05-06T15:24:07Z"
    },
    {
      id: "asset-010",
      name: "unboundid-ldapsdk-5.1.0.jar",
      type: "application",
      path: "target/dependency/unboundid-ldapsdk-5.1.0.jar",
      status: "active",
      crypto_functions: 33,
      last_scan: "2026-05-06T15:24:07Z"
    }
  ]
};

export const MOCK_CERTIFICATES = {
  total: 15,
  expiring_soon: 3,
  certificates: [
    {
      id: "cert-001",
      common_name: "gcm-server.local",
      issuer: "GCM Internal CA",
      valid_from: "2025-01-01T00:00:00Z",
      valid_until: "2026-06-01T00:00:00Z",
      days_until_expiry: 26,
      status: "expiring_soon",
      algorithm: "RSA",
      key_size: 2048
    },
    {
      id: "cert-002",
      common_name: "api.gcm.local",
      issuer: "GCM Internal CA",
      valid_from: "2025-02-01T00:00:00Z",
      valid_until: "2026-05-15T00:00:00Z",
      days_until_expiry: 9,
      status: "expiring_soon",
      algorithm: "RSA",
      key_size: 2048
    },
    {
      id: "cert-003",
      common_name: "keycloak.gcm.local",
      issuer: "GCM Internal CA",
      valid_from: "2025-03-01T00:00:00Z",
      valid_until: "2026-05-20T00:00:00Z",
      days_until_expiry: 14,
      status: "expiring_soon",
      algorithm: "RSA",
      key_size: 4096
    },
    {
      id: "cert-004",
      common_name: "db.gcm.local",
      issuer: "GCM Internal CA",
      valid_from: "2025-01-15T00:00:00Z",
      valid_until: "2027-01-15T00:00:00Z",
      days_until_expiry: 619,
      status: "active",
      algorithm: "RSA",
      key_size: 2048
    },
    {
      id: "cert-005",
      common_name: "vault.gcm.local",
      issuer: "GCM Internal CA",
      valid_from: "2025-02-01T00:00:00Z",
      valid_until: "2027-02-01T00:00:00Z",
      days_until_expiry: 636,
      status: "active",
      algorithm: "ECDSA",
      key_size: 256
    }
  ]
};

export const MOCK_CRYPTO_INVENTORY = {
  total_crypto_objects: 110,
  by_algorithm: {
    "MD5": 15,
    "SHA-1": 20,
    "SHA-256": 35,
    "AES": 25,
    "RSA": 10,
    "DES": 5
  },
  weak_algorithms: {
    "MD5": 15,
    "DES": 5,
    "RC4": 3
  },
  summary: {
    total_files_scanned: 10,
    total_crypto_artifacts: 99,
    java_source_functions: 11,
    jar_artifacts: 88
  }
};
