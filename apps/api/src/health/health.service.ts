import { Injectable, Logger, Optional } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppConfigService } from '../config/app-config.service';
import { createSuccessResponse, ApiResponse } from '@framework/core';
import { HealthResponse } from '@framework/shared-types';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(
    private readonly config: AppConfigService,
    @Optional() @InjectDataSource() private readonly dataSource?: DataSource,
  ) {}

  async check(): Promise<ApiResponse<HealthResponse>> {
    const dbConfig = this.config.database;
    const dbStatus = await this.checkDatabase(dbConfig.enabled);

    const status: HealthResponse['status'] = dbStatus === 'up' ? 'ok' : 'degraded';

    return createSuccessResponse<HealthResponse>({
      status,
      version: process.env.APP_VERSION || '0.0.1',
      timestamp: new Date().toISOString(),
      env: this.config.env,
      db: dbStatus,
    });
  }

  private async checkDatabase(enabled: boolean): Promise<HealthResponse['db']> {
    if (!enabled || !this.dataSource) {
      return 'disabled';
    }

    try {
      await this.dataSource.query('SELECT 1');
      return 'up';
    } catch (err) {
      this.logger.warn('DB health check failed', err as Error);
      return 'down';
    }
  }
}
