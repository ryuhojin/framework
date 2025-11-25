import { resolveAppEnv, AppEnv } from '@framework/core';

export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  name: string;
}

export interface ServiceConfig {
  host: string;
  port: number;
}

export interface AppConfig {
  env: AppEnv;
  nodeEnv: 'development' | 'production' | 'test';
  api: ServiceConfig;
  web: ServiceConfig;
  database: DatabaseConfig;
}

export const loadConfig = (env: NodeJS.ProcessEnv): AppConfig => {
  const envName = resolveAppEnv(env.APP_ENV);
  return {
    env: envName,
    nodeEnv: (env.NODE_ENV as AppConfig['nodeEnv']) || 'development',
    api: {
      host: env.API_HOST || '0.0.0.0',
      port: Number(env.API_PORT || 3000),
    },
    web: {
      host: env.WEB_HOST || '0.0.0.0',
      port: Number(env.WEB_PORT || 3001),
    },
    database: {
      host: env.DB_HOST || 'localhost',
      port: Number(env.DB_PORT || 5432),
      user: env.DB_USER || 'app_user',
      password: env.DB_PASSWORD || 'app_password',
      name: env.DB_NAME || 'app_db',
    },
  };
};
