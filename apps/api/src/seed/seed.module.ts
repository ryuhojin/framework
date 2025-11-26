import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../database/entities/user.entity';
import { RoleEntity } from '../database/entities/role.entity';
import { PermissionEntity } from '../database/entities/permission.entity';
import { MenuEntity } from '../database/entities/menu.entity';
import { SeedService } from './seed.service';
import { AppConfigModule } from '../config/app-config.module';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forFeature([UserEntity, RoleEntity, PermissionEntity, MenuEntity]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
