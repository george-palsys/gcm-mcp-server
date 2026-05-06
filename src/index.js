#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import dotenv from 'dotenv';
import { GCMAuthClient } from './auth.js';
import { GCM_TOOLS, TOOL_ENDPOINT_MAP } from './tools.js';
import { MOCK_IT_ASSETS, MOCK_CERTIFICATES, MOCK_CRYPTO_INVENTORY } from './mock-data.js';

// Load environment variables
dotenv.config();

// Check if mock mode is enabled
const MOCK_MODE = process.env.GCM_MOCK_MODE === 'true';

/**
 * GCM MCP Server
 * Provides MCP interface to IBM Guardium Cryptography Manager
 */
class GCMServer {
  constructor() {
    this.server = new Server(
      {
        name: 'gcm-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Initialize GCM auth client
    this.authClient = new GCMAuthClient({
      keycloakUrl: process.env.GCM_KEYCLOAK_URL,
      keycloakRealm: process.env.GCM_KEYCLOAK_REALM || 'guardium',
      clientId: process.env.GCM_CLIENT_ID,
      clientSecret: process.env.GCM_CLIENT_SECRET,
      gcmUrl: process.env.GCM_URL,
      username: process.env.GCM_USERNAME,
      password: process.env.GCM_PASSWORD,
    });

    this.setupHandlers();
    this.setupErrorHandling();
  }

  /**
   * Setup MCP request handlers
   */
  setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: GCM_TOOLS,
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) =>
      this.handleToolCall(request)
    );
  }

  /**
   * Setup error handling
   */
  setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  /**
   * Handle mock tool calls
   */
  handleMockToolCall(name, args) {
    let result;
    
    switch (name) {
      case 'list_it_assets':
        result = MOCK_IT_ASSETS;
        break;
      
      case 'count_it_assets':
        const assetType = args?.asset_type || 'all';
        if (assetType === 'all') {
          result = { total: MOCK_IT_ASSETS.total };
        } else {
          const filtered = MOCK_IT_ASSETS.assets.filter(a => a.type === assetType);
          result = { total: filtered.length };
        }
        break;
      
      case 'list_certificates':
        const status = args?.status || 'all';
        if (status === 'expiring_soon') {
          result = {
            total: MOCK_CERTIFICATES.expiring_soon,
            certificates: MOCK_CERTIFICATES.certificates.filter(c => c.status === 'expiring_soon')
          };
        } else if (status === 'all') {
          result = MOCK_CERTIFICATES;
        } else {
          result = {
            total: MOCK_CERTIFICATES.certificates.filter(c => c.status === status).length,
            certificates: MOCK_CERTIFICATES.certificates.filter(c => c.status === status)
          };
        }
        break;
      
      case 'get_crypto_inventory':
        result = MOCK_CRYPTO_INVENTORY;
        break;
      
      default:
        result = { 
          message: `Mock data not available for tool: ${name}`,
          note: "This is mock mode. Real API connection failed due to authentication issues."
        };
    }
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  /**
   * Build request body for GCM API calls
   * GCM API uses POST with request body for most list operations
   */
  buildRequestBody(name, args) {
    const body = {
      filters: {},
      page: 0,
      size: args?.limit || 100
    };

    // Add filters based on tool arguments
    switch (name) {
      case 'list_it_assets':
        if (args?.asset_type && args.asset_type !== 'all') {
          body.filters.asset_type = args.asset_type;
        }
        if (args?.status && args.status !== 'all') {
          body.filters.status = args.status;
        }
        break;

      case 'list_certificates':
        if (args?.status && args.status !== 'all') {
          body.filters.status = args.status;
        }
        if (args?.days_until_expiry) {
          body.filters.days_until_expiry = args.days_until_expiry;
        }
        break;

      case 'list_crypto_objects':
        if (args?.object_type && args.object_type !== 'all') {
          body.filters.object_type = args.object_type;
        }
        if (args?.algorithm) {
          body.filters.algorithm = args.algorithm;
        }
        break;

      case 'list_policies':
        if (args?.type && args.type !== 'all') {
          body.filters.type = args.type;
        }
        break;

      case 'list_policy_violations':
        if (args?.severity && args.severity !== 'all') {
          body.filters.severity = args.severity;
        }
        if (args?.status && args.status !== 'all') {
          body.filters.status = args.status;
        }
        body.size = args?.limit || 100;
        break;
    }

    return body;
  }

  /**
   * Determine asset category and type for asset-related endpoints
   */
  getAssetCategoryAndType(name, args) {
    switch (name) {
      case 'list_it_assets':
        return { category: 'it_assets', type: args?.asset_type || 'all' };
      
      case 'list_crypto_objects':
        const objectType = args?.object_type || 'certificates';
        return { category: 'crypto_objects', type: objectType };
      
      case 'get_it_asset':
        return { category: 'it_assets', type: 'details' };
      
      case 'get_crypto_object':
        return { category: 'crypto_objects', type: args?.object_type || 'certificates' };
      
      default:
        return null;
    }
  }

  /**
   * Handle tool call requests
   */
  async handleToolCall(request) {
    const { name, arguments: args } = request.params;

    try {
      // Handle mock mode
      if (MOCK_MODE) {
        return this.handleMockToolCall(name, args);
      }

      // Get endpoint configuration
      const endpoint = TOOL_ENDPOINT_MAP[name];
      if (!endpoint) {
        throw new Error(`Unknown tool: ${name}`);
      }

      // Build API path with parameters
      let path = endpoint.path;
      let bodyData = null;

      // Special handling for asset-related endpoints that need category/type
      const assetInfo = this.getAssetCategoryAndType(name, args);
      if (assetInfo) {
        path = path.replace('{asset_category}', assetInfo.category);
        path = path.replace('{asset_type}', assetInfo.type);
      }

      // Replace other path parameters
      for (const [key, value] of Object.entries(args || {})) {
        if (path.includes(`{${key}}`)) {
          path = path.replace(`{${key}}`, value);
        }
      }

      // Build request body for POST requests
      if (endpoint.method === 'POST' && this.requiresRequestBody(name)) {
        bodyData = this.buildRequestBody(name, args);
      } else if (endpoint.method === 'POST' || endpoint.method === 'PUT') {
        // For other POST/PUT requests, use args directly as body
        bodyData = args || {};
      }

      // For GET requests, add query parameters
      if (endpoint.method === 'GET') {
        const queryParams = {};
        for (const [key, value] of Object.entries(args || {})) {
          if (!path.includes(`{${key}}`)) {
            queryParams[key] = value;
          }
        }
        
        if (Object.keys(queryParams).length > 0) {
          const queryString = new URLSearchParams(queryParams).toString();
          path += `?${queryString}`;
        }
      }

      // Make authenticated request to GCM
      const result = await this.authClient.makeRequest(
        endpoint.method,
        path,
        bodyData
      );

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error executing ${name}: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  /**
   * Check if a tool requires a request body
   */
  requiresRequestBody(name) {
    const bodyRequiredTools = [
      'list_it_assets',
      'list_certificates',
      'list_crypto_objects',
      'list_policies',
      'list_policy_violations',
      'list_vaults',
      'get_crypto_inventory',
      'get_compliance_report',
      'get_risk_assessment'
    ];
    return bodyRequiredTools.includes(name);
  }

  /**
   * Start the MCP server
   */
  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('GCM MCP server running on stdio');
  }
}

// Validate required environment variables
const requiredEnvVars = [
  'GCM_KEYCLOAK_URL',
  'GCM_CLIENT_ID',
  'GCM_CLIENT_SECRET',
  'GCM_URL',
  'GCM_USERNAME',
  'GCM_PASSWORD',
];

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('Error: Missing required environment variables:');
  missingVars.forEach((varName) => console.error(`  - ${varName}`));
  console.error('\nPlease set these variables in your .env file or environment.');
  process.exit(1);
}

// Start server
const server = new GCMServer();
server.run().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});