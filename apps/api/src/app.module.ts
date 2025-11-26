import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/app-config.module';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { RbacModule } from './rbac/rbac.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [AppConfigModule, DatabaseModule.forRoot(), AuthModule, RbacModule, SeedModule, HealthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
