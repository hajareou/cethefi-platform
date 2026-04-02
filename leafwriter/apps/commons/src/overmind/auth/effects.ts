import type { Provider } from '@src/services';
import axios from 'axios';

export interface HTTPRequestError {
  error: {
    status?: number;
    message: string;
  };
}

export interface LinkedAccount {
  identityProvider?: string;
  userId?: string;
  userName?: string;
}

export type LinkedAccounts = LinkedAccount[];

const STORAGE_KEY = 'leafwriterSessionToken';

class Api {
  private sessionToken: string | null = null;
  private _userData: any = null;
  private githubAccessToken: string | null = null;
  private AUTH_API_BASE_URL = 'http://localhost:8091';

  /**
   * Setup the API using the backend session (GitHub OAuth).
   * Reads the session token from:
   *   1. `?sessionToken=` URL param  — set by cethefi-platform when navigating to Leafwriter
   *   2. `?token=`        URL param  — set by the backend OAuth callback on direct login
   *   3. localStorage                — persisted from a previous visit
   */
  async setup() {
    // Ask the Leafwriter server which backend URL to use
    try {
      const { data } = await axios.get<string>('./api/auth-api-url');
      if (data) this.AUTH_API_BASE_URL = data.replace(/\/$/, '');
    } catch {
      // fall through – keep the default
    }

    // Extract token from URL params (clean up the URL afterwards)
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('sessionToken') ?? urlParams.get('token');

    if (urlToken) {
      localStorage.setItem(STORAGE_KEY, urlToken);
      this.sessionToken = urlToken;

      urlParams.delete('sessionToken');
      urlParams.delete('token');
      urlParams.delete('provider');
      urlParams.delete('expiresAt');
      const clean =
        window.location.pathname +
        (urlParams.toString() ? '?' + urlParams.toString() : '') +
        window.location.hash;
      window.history.replaceState({}, '', clean);
    } else {
      this.sessionToken = localStorage.getItem(STORAGE_KEY);
    }

    // Validate the token against the backend
    if (this.sessionToken) {
      try {
        const { data } = await axios.get(`${this.AUTH_API_BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${this.sessionToken}` },
        });
        this._userData = data;
        this.githubAccessToken = data.githubAccessToken ?? null;
      } catch {
        // Token is invalid or expired – clear it
        this.sessionToken = null;
        this._userData = null;
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }

  /** Returns true if the user has a valid session. */
  async init() {
    return !!this._userData;
  }

  /** Returns the session Bearer token. */
  async getToken() {
    return this.sessionToken;
  }

  /** Always returns 'github' since that is our only identity provider. */
  getIdentityProvider() {
    return this._userData ? 'github' : undefined;
  }

  /**
   * Returns the GitHub access token stored in the session.
   * This replaces the Keycloak broker token exchange.
   */
  async getExternalIDPTokens(
    _provider_alias: string,
    _token: string,
  ): Promise<string | Record<string, unknown> | Error> {
    if (this.githubAccessToken) {
      // github.ts authenticate() parses IDPTokens as query string to extract access_token
      return `access_token=${this.githubAccessToken}&token_type=bearer`;
    }
    // Return { error } shape so actions.tsx check `'error' in IDPTokens` works correctly
    return { error: 'No GitHub access token available in session' };
  }

  /** Maps the backend user object to the shape Leafwriter expects. */
  async getUserData() {
    if (!this._userData?.user) return undefined;
    const u = this._userData.user;
    const nameParts = (u.name || u.username || '').trim().split(/\s+/);
    return {
      username: u.username,
      email: u.email ?? undefined,
      emailVerified: false,
      firstName: nameParts[0],
      lastName: nameParts.length > 1 ? nameParts.slice(1).join(' ') : undefined,
      avatar_url: u.avatarUrl ?? undefined,
      url: u.profileUrl ?? `https://github.com/${u.username}`,
    };
  }

  /**
   * Returns a hard-coded GitHub provider so Leafwriter can initialise
   * the GitHub storage/identity service.
   */
  async getProviders(): Promise<Provider[] | Error> {
    return [{ providerId: 'github', enabled: true } as unknown as Provider];
  }

  /**
   * Redirect the user to GitHub OAuth via the backend.
   * After login the backend will redirect back to the current page with
   * `?token=<session_token>` which `setup()` will pick up on reload.
   */
  async login(_options?: { idpHint?: string }) {
    const redirect = encodeURIComponent(window.location.href);
    window.location.href =
      `${this.AUTH_API_BASE_URL}/api/auth/github/start?frontendRedirectUrl=${redirect}`;
  }

  /** Calls the backend logout endpoint and clears local state. */
  async logout() {
    if (this.sessionToken) {
      try {
        await axios.post(
          `${this.AUTH_API_BASE_URL}/api/auth/logout`,
          {},
          { headers: { Authorization: `Bearer ${this.sessionToken}` } },
        );
      } catch {
        // best-effort logout
      }
    }
    localStorage.removeItem(STORAGE_KEY);
    this.sessionToken = null;
    this._userData = null;
    this.githubAccessToken = null;
  }

  isLoggedIn() {
    return !!this._userData;
  }

  /** Sessions are managed server-side; token expiry is not tracked client-side. */
  isTokenExpired() {
    return false;
  }

  /** No-op: sessions are refreshed server-side. */
  async updateToken() {}

  userHasRole(roles: string[]) {
    const permissions: string[] = this._userData?.permissions ?? [];
    return roles.some((r) => permissions.includes(r) || permissions.includes('*'));
  }

  userHasResourceRole(role: string, _resource?: string) {
    return this.userHasRole([role]);
  }

  /** Not supported without Keycloak. */
  accountManagement() {}

  /**
   * Returns the single GitHub linked account from the session.
   * Replaces the LINCS auth-api linked accounts endpoint.
   */
  async getLinkedAccounts(
    _token: string,
    _username: string,
  ): Promise<LinkedAccount[] | HTTPRequestError> {
    if (!this._userData?.user) {
      return { error: { message: 'Not authenticated' } };
    }
    const u = this._userData.user;
    return [
      {
        identityProvider: 'github',
        userId: String(u.id ?? '').replace('github:', ''),
        userName: u.username,
      },
    ];
  }

  /** Account linking is not supported in standalone GitHub OAuth mode. */
  async getLinkAccountUrl(_params: {
    username: string;
    provider: string;
    keycloakAccessCode: string;
  }): Promise<string | HTTPRequestError> {
    return {
      error: { message: 'Account linking is not supported in GitHub OAuth mode' },
    };
  }
}

export const api = new Api();
