import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { RbacService } from './rbac.service';
import { createSuccessResponse, ApiResponse } from '@framework/core';
import { RoleEntity } from '../database/entities/role.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequirePermissions } from '../auth/permissions.decorator';
import { PermissionGuard } from '../auth/permission.guard';

@Controller('admin/roles')
@UseGuards(JwtAuthGuard, PermissionGuard)
@RequirePermissions('MANAGE_ROLE')
export class RolesController {
  constructor(private readonly rbacService: RbacService) {}

  @Get()
  async list(): Promise<ApiResponse<RoleEntity[]>> {
    const roles = await this.rbacService.findRoles();
    return createSuccessResponse(roles);
  }

  @Post()
  async create(@Body() payload: Partial<RoleEntity>): Promise<ApiResponse<RoleEntity>> {
    const role = await this.rbacService.createRole(payload);
    return createSuccessResponse(role);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() payload: Partial<RoleEntity>,
  ): Promise<ApiResponse<RoleEntity>> {
    const role = await this.rbacService.updateRole(id, payload);
    return createSuccessResponse(role);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ApiResponse<unknown>> {
    await this.rbacService.deleteRole(id);
    return createSuccessResponse({ id });
  }
}
