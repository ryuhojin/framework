import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigService } from './app-config.service';
import { resolveAppEnv } from '@framework/core';
import * as fs from 'fs';
import * as path from 'path';

const envPaths = (): string[] => {
  const env = resolveAppEnv(process.env.APP_ENV);
  const cwd = process.cwd();
  const candidates = [
    path.join(cwd, `.env.${env}`),
    path.join(cwd, '.env.local'),
    path.join(cwd, '.env'),
  ];
  return candidates.filter((p) => fs.existsSync(p));
};

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envPaths(),
      ignoreEnvVars: false,
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
