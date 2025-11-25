import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiError, createErrorResponse } from '@framework/core';
import { AppConfigService } from '../../config/app-config.service';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  constructor(private readonly config: AppConfigService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let error: ApiError = {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error',
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as { message?: string | string[]; error?: string };
      const message = Array.isArray(res?.message) ? res.message.join(', ') : res?.message || exception.message;
      error = {
        code: res?.error || 'HTTP_ERROR',
        message: message || 'Request failed',
        detail: this.config.env === 'prod' ? undefined : res,
      };
    } else if (exception instanceof Error) {
      error = {
        code: 'UNCAUGHT_ERROR',
        message: this.config.env === 'prod' ? 'Internal server error' : exception.message,
        detail: this.config.env === 'prod' ? undefined : exception.stack,
      };
    }

    if (status >= 500) {
      this.logger.error(error.message, this.config.env === 'prod' ? undefined : (exception as Error)?.stack);
    }

    response.status(status).json(createErrorResponse(error, request.headers['x-request-id'] as string));
  }
}
