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

// Load environment variables
dotenv.config();

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
   * Handle tool call requests
   */
  async handleToolCall(request) {
    const { name, arguments: args } = request.params;

    try {
      // Get endpoint configuration
      const endpoint = TOOL_ENDPOINT_MAP[name];
      if (!endpoint) {
        throw new Error(`Unknown tool: ${name}`);
      }

      // Build API path with parameters
      let path = endpoint.path;
      const queryParams = {};
      const bodyData = {};

      // Replace path parameters and separate query/body params
      for (const [key, value] of Object.entries(args || {})) {
        if (path.includes(`{${key}}`)) {
          path = path.replace(`{${key}}`, value);
        } else if (endpoint.method === 'GET') {
          queryParams[key] = value;
        } else {
          bodyData[key] = value;
        }
      }

      // Add query parameters to path
      if (Object.keys(queryParams).length > 0) {
        const queryString = new URLSearchParams(queryParams).toString();
        path += `?${queryString}`;
      }

      // Make authenticated request to GCM
      const result = await this.authClient.makeRequest(
        endpoint.method,
        path,
        Object.keys(bodyData).length > 0 ? bodyData : null
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
