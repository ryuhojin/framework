import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UserEntity } from '../database/entities/user.entity';
import { AppConfigService } from '../config/app-config.service';
import { JwtService } from '@nestjs/jwt';

const mockUser = async (): Promise<UserEntity> => {
  const user = new UserEntity();
  user.id = 'u1';
  user.username = 'tester';
  user.password = await bcrypt.hash('pass1234', 4);
  user.status = 'ACTIVE';
  user.roles = [];
  user.loginFailCount = 0;
  return user;
};

describe('AuthService', () => {
  it('로그인 실패 시 UnauthorizedException을 발생시킨다', async () => {
    const user = await mockUser();
    const repo: any = { findOne: jest.fn().mockResolvedValue(user), save: jest.fn() };
    const config: any = { security: { jwtSecret: 'secret', jwtExpiresIn: '1h', bcryptSaltOrRounds: 4 } };
    const jwt: any = { signAsync: jest.fn() };
    const service = new AuthService(repo, jwt as unknown as JwtService, config as AppConfigService);

    await expect(service.login('tester', 'wrong')).rejects.toThrow('Invalid credentials');
  });
});
