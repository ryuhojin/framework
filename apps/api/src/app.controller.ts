import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { HealthResponse, ApiInfo } from '@framework/shared-types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHealth(): HealthResponse {
    return this.appService.getHealth();
  }

  @Get('info')
  getInfo(): ApiInfo {
    return this.appService.getInfo();
  }
}
