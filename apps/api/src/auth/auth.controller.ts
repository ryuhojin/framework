import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { createSuccessResponse, ApiResponse } from '@framework/core';
import { AuthTokenResponse } from '@framework/shared-types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto): Promise<ApiResponse<AuthTokenResponse>> {
    const tokens = await this.authService.login(dto.username, dto.password);
    return createSuccessResponse(tokens);
  }
}
