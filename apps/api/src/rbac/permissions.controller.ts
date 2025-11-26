import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { RbacService } from './rbac.service';
import { createSuccessResponse, ApiResponse } from '@framework/core';
import { PermissionEntity } from '../database/entities/permission.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequirePermissions } from '../auth/permissions.decorator';
import { PermissionGuard } from '../auth/permission.guard';

@Controller('admin/permissions')
@UseGuards(JwtAuthGuard, PermissionGuard)
@RequirePermissions('MANAGE_PERMISSION')
export class PermissionsController {
  constructor(private readonly rbacService: RbacService) {}

  @Get()
  async list(): Promise<ApiResponse<PermissionEntity[]>> {
    const items = await this.rbacService.findPermissions();
    return createSuccessResponse(items);
  }

  @Post()
  async create(
    @Body() payload: Partial<PermissionEntity>,
  ): Promise<ApiResponse<PermissionEntity>> {
    const item = await this.rbacService.createPermission(payload);
    return createSuccessResponse(item);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() payload: Partial<PermissionEntity>,
  ): Promise<ApiResponse<PermissionEntity>> {
    const item = await this.rbacService.updatePermission(id, payload);
    return createSuccessResponse(item);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ApiResponse<unknown>> {
    await this.rbacService.deletePermission(id);
    return createSuccessResponse({ id });
  }
}
