export interface HealthResponse {
  status: 'ok' | 'degraded';
  version: string;
  timestamp: string;
  env: string;
  db: 'up' | 'down' | 'disabled';
}

export interface ApiInfo {
  name: string;
  description: string;
}

export interface AuthTokenResponse {
  accessToken: string;
  expiresIn: string;
}
