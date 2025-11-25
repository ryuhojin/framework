import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiInfo } from '@framework/shared-types';
import { ApiResponse } from '@framework/core';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('info')
  getInfo(): ApiResponse<ApiInfo> {
    return this.appService.getInfo();
  }
}
