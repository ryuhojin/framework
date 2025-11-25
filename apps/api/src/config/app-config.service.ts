import { Injectable, LogLevel } from '@nestjs/common';
import { AppConfig, loadConfig } from '@framework/config';
import { AppEnv } from '@framework/core';

const logLevelMap: Record<AppConfig['security']['logLevel'], LogLevel[]> = {
  debug: ['log', 'error', 'warn', 'debug', 'verbose'],
  info: ['log', 'error', 'warn'],
  warn: ['log', 'error', 'warn'],
  error: ['error'],
};

@Injectable()
export class AppConfigService {
  private readonly config: AppConfig;

  constructor() {
    this.config = loadConfig();
  }

  get value(): AppConfig {
    return this.config;
  }

  get env(): AppEnv {
    return this.config.env;
  }

  get app() {
    return this.config.app;
  }

  get database() {
    return this.config.database;
  }

  get security() {
    return this.config.security;
  }

  getLogLevels(): LogLevel[] {
    return logLevelMap[this.config.security.logLevel] || logLevelMap.info;
  }
}
