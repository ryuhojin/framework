import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfigService } from '../config/app-config.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../database/entities/user.entity';

export interface JwtPayload {
  sub: string;
  username: string;
  roles: string[];
  permissions: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: AppConfigService,
    @InjectRepository(UserEntity) private readonly users: Repository<UserEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.security.jwtSecret,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.users.findOne({
      where: { id: payload.sub },
      relations: ['roles', 'roles.permissions'],
    });
    if (!user) {
      return null;
    }
    const roleNames = user.roles?.map((r) => r.name) || [];
    const permissionCodes = (user.roles || []).flatMap((r) =>
      (r.permissions || []).filter((p) => p.isActive).map((p) => p.code),
    );
    return {
      id: user.id,
      username: user.username,
      roles: roleNames,
      permissions: Array.from(new Set(permissionCodes)),
    };
  }
}
