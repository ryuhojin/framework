import { Injectable } from '@nestjs/common';
import { frameworkName, timestamp } from '@framework/core';
import { HealthResponse, ApiInfo } from '@framework/shared-types';

@Injectable()
export class AppService {
  getHealth(): HealthResponse {
    return {
      status: 'ok',
      version: process.env.APP_VERSION || '0.0.1',
      timestamp: timestamp(),
    };
  }

  getInfo(): ApiInfo {
    return {
      name: frameworkName,
      description: 'NestJS API skeleton prepared for financial-grade services',
    };
  }
}
