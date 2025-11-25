import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app-config.service';
import { ApiExceptionFilter } from './common/filters/api-exception.filter';
import { HttpLoggingInterceptor } from './common/interceptors/http-logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const config = app.get(AppConfigService);

  app.useLogger(config.getLogLevels());

  if (config.security.enableHelmet) {
    app.use(
      helmet({
        contentSecurityPolicy: config.security.cspEnabled ? undefined : false,
      }),
    );
  }

  app.enableCors({
    origin: config.security.corsAllowedOrigins.length
      ? config.security.corsAllowedOrigins
      : true,
    credentials: true,
  });

  app.useGlobalFilters(new ApiExceptionFilter(config));
  app.useGlobalInterceptors(new HttpLoggingInterceptor());

  await app.listen(config.app.port, config.app.host);
}
bootstrap();
