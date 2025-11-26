import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { RbacService } from './rbac.service';
import { createSuccessResponse, ApiResponse } from '@framework/core';
import { MenuEntity } from '../database/entities/menu.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequirePermissions } from '../auth/permissions.decorator';
import { PermissionGuard } from '../auth/permission.guard';

@Controller('admin/menus')
@UseGuards(JwtAuthGuard, PermissionGuard)
@RequirePermissions('MANAGE_MENU')
export class MenusController {
  constructor(private readonly rbacService: RbacService) {}

  @Get()
  async list(): Promise<ApiResponse<MenuEntity[]>> {
    const items = await this.rbacService.findMenus();
    return createSuccessResponse(items);
  }

  @Post()
  async create(@Body() payload: Partial<MenuEntity>): Promise<ApiResponse<MenuEntity>> {
    const item = await this.rbacService.createMenu(payload);
    return createSuccessResponse(item);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() payload: Partial<MenuEntity>,
  ): Promise<ApiResponse<MenuEntity>> {
    const item = await this.rbacService.updateMenu(id, payload);
    return createSuccessResponse(item);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ApiResponse<unknown>> {
    await this.rbacService.deleteMenu(id);
    return createSuccessResponse({ id });
  }
}
