import axios from 'axios';

/**
 * GCM OAuth2 Authentication Client
 * Handles two-step authentication flow:
 * 1. Get access token from Keycloak
 * 2. Authorize with GCM user management endpoint
 */
export class GCMAuthClient {
  constructor(config) {
    this.keycloakUrl = config.keycloakUrl;
    this.keycloakRealm = config.keycloakRealm;
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.gcmUrl = config.gcmUrl;
    this.username = config.username;
    this.password = config.password;
    
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  /**
   * Step 1: Get access token from Keycloak
   */
  async getKeycloakToken() {
    const tokenUrl = `${this.keycloakUrl}/realms/${this.keycloakRealm}/protocol/openid-connect/token`;
    
    const params = new URLSearchParams({
      grant_type: 'password',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      username: this.username,
      password: this.password
    });

    try {
      const response = await axios.post(tokenUrl, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      this.accessToken = response.data.access_token;
      // Set expiry time (subtract 60 seconds for safety margin)
      this.tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000;
      
      return this.accessToken;
    } catch (error) {
      throw new Error(`Keycloak authentication failed: ${error.message}`);
    }
  }

  /**
   * Step 2: Authorize with GCM user management endpoint
   */
  async authorizeWithGCM(token) {
    const authUrl = `${this.gcmUrl}/api/v1/user-management/authorize`;
    
    try {
      const response = await axios.post(authUrl, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      throw new Error(`GCM authorization failed: ${error.message}`);
    }
  }

  /**
   * Get valid access token (refresh if expired)
   */
  async getValidToken() {
    // Check if token exists and is not expired
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    // Get new token
    const token = await this.getKeycloakToken();
    await this.authorizeWithGCM(token);
    
    return token;
  }

  /**
   * Make authenticated request to GCM API
   */
  async makeRequest(method, endpoint, data = null) {
    const token = await this.getValidToken();
    const url = `${this.gcmUrl}${endpoint}`;

    try {
      const config = {
        method,
        url,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      if (data) {
        config.data = data;
      }

      const response = await axios(config);
      return response.data;
    } catch (error) {
      throw new Error(`GCM API request failed: ${error.message}`);
    }
  }
}
