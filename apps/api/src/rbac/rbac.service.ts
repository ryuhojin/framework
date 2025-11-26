import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from '../database/entities/role.entity';
import { PermissionEntity } from '../database/entities/permission.entity';
import { MenuEntity } from '../database/entities/menu.entity';

@Injectable()
export class RbacService {
  constructor(
    @InjectRepository(RoleEntity) private readonly roles: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity) private readonly permissions: Repository<PermissionEntity>,
    @InjectRepository(MenuEntity) private readonly menus: Repository<MenuEntity>,
  ) {}

  // Roles
  findRoles() {
    return this.roles.find({ relations: ['permissions', 'menus'] });
  }

  async createRole(payload: Partial<RoleEntity>) {
    const entity = this.roles.create(payload);
    return this.roles.save(entity);
  }

  async updateRole(id: string, payload: Partial<RoleEntity>) {
    const existing = await this.roles.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Role not found');
    Object.assign(existing, payload);
    return this.roles.save(existing);
  }

  async deleteRole(id: string) {
    return this.roles.delete(id);
  }

  // Permissions
  findPermissions() {
    return this.permissions.find();
  }

  async createPermission(payload: Partial<PermissionEntity>) {
    const entity = this.permissions.create(payload);
    return this.permissions.save(entity);
  }

  async updatePermission(id: string, payload: Partial<PermissionEntity>) {
    const existing = await this.permissions.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Permission not found');
    Object.assign(existing, payload);
    return this.permissions.save(existing);
  }

  async deletePermission(id: string) {
    return this.permissions.delete(id);
  }

  // Menus
  findMenus() {
    return this.menus.find({ relations: ['parent', 'children', 'permissions'] });
  }

  async createMenu(payload: Partial<MenuEntity>) {
    const entity = this.menus.create(payload);
    return this.menus.save(entity);
  }

  async updateMenu(id: string, payload: Partial<MenuEntity>) {
    const existing = await this.menus.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Menu not found');
    Object.assign(existing, payload);
    return this.menus.save(existing);
  }

  async deleteMenu(id: string) {
    return this.menus.delete(id);
  }
}
