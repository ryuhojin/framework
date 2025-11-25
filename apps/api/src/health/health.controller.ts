import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { ApiResponse } from '@framework/core';
import { HealthResponse } from '@framework/shared-types';

@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('/')
  @Get('/health')
  async getHealth(): Promise<ApiResponse<HealthResponse>> {
    return this.healthService.check();
  }
}
