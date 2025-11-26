import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from './permissions.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as { permissions?: string[] };
    if (!user || !user.permissions) {
      throw new ForbiddenException('Permission denied');
    }
    const allowed = required.every((perm) => user.permissions?.includes(perm));
    if (!allowed) {
      throw new ForbiddenException('Permission denied');
    }
    return true;
  }
}
