import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AppConfigService } from '../config/app-config.service';
import { UserEntity } from '../database/entities/user.entity';
import { RoleEntity } from '../database/entities/role.entity';
import { PermissionEntity } from '../database/entities/permission.entity';
import { MenuEntity } from '../database/entities/menu.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly config: AppConfigService,
    @InjectRepository(UserEntity) private readonly users: Repository<UserEntity>,
    @InjectRepository(RoleEntity) private readonly roles: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity)
    private readonly permissions: Repository<PermissionEntity>,
    @InjectRepository(MenuEntity) private readonly menus: Repository<MenuEntity>,
  ) {}

  async onApplicationBootstrap() {
    const env = this.config.env;
    if (env === 'prod' || !this.config.database.enabled || process.env.DB_DISABLE === 'true') {
      this.logger.log('Seed skipped in prod environment');
      return;
    }
    await this.seed();
  }

  private async seed() {
    // Permissions
    const permissionCodes = [
      { code: 'MANAGE_MENU', description: '메뉴 관리', type: 'ACTION' as const },
      { code: 'MANAGE_ROLE', description: '역할 관리', type: 'ACTION' as const },
      { code: 'MANAGE_PERMISSION', description: '권한 관리', type: 'ACTION' as const },
      { code: 'VIEW_DASHBOARD', description: '대시보드 조회', type: 'MENU' as const },
    ];
    const permissionEntities = [];
    for (const p of permissionCodes) {
      const existing = await this.permissions.findOne({ where: { code: p.code } });
      if (existing) {
        permissionEntities.push(existing);
        continue;
      }
      const saved = await this.permissions.save(this.permissions.create({ ...p, isActive: true }));
      permissionEntities.push(saved);
    }

    // Menus
    let dashboardMenu = await this.menus.findOne({ where: { path: '/dashboard' }, relations: ['permissions'] });
    if (!dashboardMenu) {
      dashboardMenu = this.menus.create({
        name: '대시보드',
        path: '/dashboard',
        depth: 0,
        sortOrder: 1,
        isActive: true,
      });
      dashboardMenu.permissions = permissionEntities.filter((p) => p.code === 'VIEW_DASHBOARD');
      dashboardMenu = await this.menus.save(dashboardMenu);
    }
    const menus = [dashboardMenu];

    // Role
    let savedRole = await this.roles.findOne({
      where: { name: 'ADMIN' },
      relations: ['permissions', 'menus'],
    });
    if (!savedRole) {
      const adminRole = this.roles.create({
        name: 'ADMIN',
        description: '시스템 관리자',
        isSystemDefault: true,
        permissions: permissionEntities,
        menus,
      });
      savedRole = await this.roles.save(adminRole);
    }

    // User
    const existingAdmin = await this.users.findOne({ where: { username: 'admin' }, relations: ['roles'] });
    if (existingAdmin) {
      this.logger.log('Seed skipped: admin user already exists');
      return;
    }

    const hashed = await bcrypt.hash('admin123!', this.config.security.bcryptSaltOrRounds);
    const adminUser = this.users.create({
      username: 'admin',
      password: hashed,
      name: 'Admin',
      email: 'admin@example.com',
      status: 'ACTIVE',
      roles: [savedRole],
      loginFailCount: 0,
    });
    await this.users.save(adminUser);

    this.logger.log('Seed completed (admin/admin123! - 운영 금지)');
  }
}
