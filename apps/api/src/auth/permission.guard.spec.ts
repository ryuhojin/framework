import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionGuard } from './permission.guard';

const mockContext = (permissions?: string[]): ExecutionContext =>
  ({
    switchToHttp: () => ({
      getRequest: () => ({ user: { permissions } }),
    }),
    getHandler: () => ({}),
    getClass: () => ({}),
  } as unknown as ExecutionContext);

describe('PermissionGuard', () => {
  it('필요 권한이 없으면 ForbiddenException', () => {
    const reflector = new Reflector();
    const guard = new PermissionGuard(reflector);
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['TEST_PERMISSION']);
    expect(() => guard.canActivate(mockContext([]))).toThrow(ForbiddenException);
  });

  it('권한이 있으면 통과한다', () => {
    const reflector = new Reflector();
    const guard = new PermissionGuard(reflector);
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['TEST_PERMISSION']);
    expect(guard.canActivate(mockContext(['TEST_PERMISSION']))).toBe(true);
  });
});
