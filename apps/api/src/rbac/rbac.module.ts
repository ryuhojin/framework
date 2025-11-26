import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from '../database/entities/role.entity';
import { PermissionEntity } from '../database/entities/permission.entity';
import { MenuEntity } from '../database/entities/menu.entity';
import { UserEntity } from '../database/entities/user.entity';
import { RbacService } from './rbac.service';
import { RolesController } from './roles.controller';
import { PermissionsController } from './permissions.controller';
import { MenusController } from './menus.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([UserEntity, RoleEntity, PermissionEntity, MenuEntity])],
  controllers: [RolesController, PermissionsController, MenusController],
  providers: [RbacService],
  exports: [RbacService],
})
export class RbacModule {}
