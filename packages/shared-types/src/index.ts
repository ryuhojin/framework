export interface HealthResponse {
  status: 'ok';
  version: string;
  timestamp: string;
}

export interface ApiInfo {
  name: string;
  description: string;
}
