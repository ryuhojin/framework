import { Injectable } from '@nestjs/common';
import { frameworkName, createSuccessResponse, ApiResponse } from '@framework/core';
import { ApiInfo } from '@framework/shared-types';
import { AppConfigService } from './config/app-config.service';

@Injectable()
export class AppService {
  constructor(private readonly config: AppConfigService) {}

  getInfo(): ApiResponse<ApiInfo> {
    return createSuccessResponse<ApiInfo>({
      name: frameworkName,
      description: `NestJS API skeleton prepared for financial-grade services (env: ${this.config.env})`,
    });
  }
}
