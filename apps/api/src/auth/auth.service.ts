import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../database/entities/user.entity';
import { AppConfigService } from '../config/app-config.service';
import { AuthTokenResponse } from '@framework/shared-types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private readonly users: Repository<UserEntity>,
    private readonly jwt: JwtService,
    private readonly config: AppConfigService,
  ) {}

  async validateUser(username: string, password: string): Promise<UserEntity> {
    const user = await this.users.findOne({
      where: { username },
      relations: ['roles', 'roles.permissions'],
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (user.status === 'LOCKED' || user.status === 'DISABLED') {
      throw new UnauthorizedException('Account locked');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      user.loginFailCount = (user.loginFailCount || 0) + 1;
      await this.users.save(user);
      throw new UnauthorizedException('Invalid credentials');
    }

    user.loginFailCount = 0;
    user.lastLoginAt = new Date();
    await this.users.save(user);
    return user;
  }

  async login(username: string, password: string): Promise<AuthTokenResponse> {
    const user = await this.validateUser(username, password);

    const roles = user.roles?.map((r) => r.name) || [];
    const permissions = (user.roles || []).flatMap((r) =>
      (r.permissions || []).filter((p) => p.isActive).map((p) => p.code),
    );

    const payload = {
      sub: user.id,
      username: user.username,
      roles,
      permissions: Array.from(new Set(permissions)),
    };

    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.config.security.jwtSecret,
      expiresIn: this.config.security.jwtExpiresIn,
    });

    return {
      accessToken,
      expiresIn: this.config.security.jwtExpiresIn,
    };
  }
}
