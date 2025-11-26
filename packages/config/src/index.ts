import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { resolveAppEnv, AppEnv } from '@framework/core';

export type DatabaseVendor = 'postgres' | 'oracle' | 'mssql' | 'tibero';

export interface DatabaseConfig {
  enabled: boolean;
  vendor: DatabaseVendor;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  schema?: string;
}

export interface AppSettings {
  port: number;
  host: string;
  baseUrl: string;
}

export interface SecurityConfig {
  corsAllowedOrigins: string[];
  enableHelmet: boolean;
  cspEnabled: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  jwtSecret: string;
  jwtExpiresIn: string;
  bcryptSaltOrRounds: number;
}

export interface AppConfig {
  env: AppEnv;
  nodeEnv: 'development' | 'production' | 'test';
  app: AppSettings;
  database: DatabaseConfig;
  security: SecurityConfig;
}

const corsDefaults: Record<AppEnv, string[]> = {
  local: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:4200',
  ],
  dev: ['https://dev.example.com', 'https://dev-api.example.com'],
  prod: ['https://example.com', 'https://api.example.com'],
};

const logLevelDefaults: Record<AppEnv, SecurityConfig['logLevel']> = {
  local: 'debug',
  dev: 'info',
  prod: 'warn',
};

const envFileFor = (env: AppEnv): string => `.env.${env}`;

const parseBool = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined) return fallback;
  return value.toLowerCase() === 'true' || value === '1';
};

const parseList = (value: string | undefined, fallback: string[]): string[] => {
  if (!value) return fallback;
  return value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
};

const parseVendor = (value?: string): DatabaseVendor => {
  if (value === 'oracle' || value === 'mssql' || value === 'tibero') {
    return value;
  }
  return 'postgres';
};

const loadEnvFiles = (env: AppEnv, cwd: string): void => {
  const candidates = [
    path.join(cwd, '.env'),
    path.join(cwd, envFileFor(env)),
    path.join(cwd, '.env.local'),
  ];
  candidates.forEach((filePath) => {
    if (fs.existsSync(filePath)) {
      dotenv.config({ path: filePath });
    }
  });
};

export interface LoadConfigOptions {
  cwd?: string;
  loadEnvFile?: boolean;
  env?: NodeJS.ProcessEnv;
}

export const loadConfig = (options: LoadConfigOptions = {}): AppConfig => {
  const envInput = options.env ?? process.env;
  const cwd = options.cwd ?? process.cwd();
  const envName = resolveAppEnv(envInput.APP_ENV);

  if (options.loadEnvFile !== false) {
    loadEnvFiles(envName, cwd);
  }

  const env = { ...envInput, ...process.env };
  const cors = parseList(env.CORS_ALLOWED_ORIGINS, corsDefaults[envName]);

  return {
    env: envName,
    nodeEnv: (env.NODE_ENV as AppConfig['nodeEnv']) || 'development',
    app: {
      port: Number(env.API_PORT || env.APP_PORT || 3000),
      host: env.API_HOST || env.APP_HOST || '0.0.0.0',
      baseUrl: env.APP_BASE_URL || `http://localhost:${env.API_PORT || 3000}`,
    },
    database: {
      enabled: !parseBool(env.DB_DISABLE, false),
      vendor: parseVendor(env.DB_VENDOR),
      host: env.DB_HOST || 'localhost',
      port: Number(env.DB_PORT || 5432),
      username: env.DB_USER || 'app_user',
      password: env.DB_PASSWORD || 'app_password',
      database: env.DB_NAME || 'app_db',
      schema: env.DB_SCHEMA || undefined,
    },
    security: {
      corsAllowedOrigins: cors,
      enableHelmet: parseBool(env.ENABLE_HELMET, true),
      cspEnabled: parseBool(env.CSP_ENABLED, false),
      logLevel: (env.LOG_LEVEL as SecurityConfig['logLevel']) || logLevelDefaults[envName],
      jwtSecret: env.JWT_SECRET || 'change_me_in_prod',
      jwtExpiresIn: env.JWT_EXPIRES_IN || (envName === 'prod' ? '15m' : '1h'),
      bcryptSaltOrRounds: Number(env.BCRYPT_SALT_OR_ROUNDS || 10),
    },
  };
};

export type { LoadConfigOptions as ConfigOptions };
