import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppConfigService } from '../config/app-config.service';
import { UserEntity } from './entities/user.entity';
import { RoleEntity } from './entities/role.entity';
import { PermissionEntity } from './entities/permission.entity';
import { MenuEntity } from './entities/menu.entity';

const dbDisabled = (): boolean => process.env.DB_DISABLE === 'true';

@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    if (dbDisabled()) {
      return {
        module: DatabaseModule,
        imports: [
          TypeOrmModule.forRoot({
            type: 'sqlite',
            database: ':memory:',
            synchronize: true,
            entities: [UserEntity, RoleEntity, PermissionEntity, MenuEntity],
          }),
        ],
      };
    }

    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          inject: [AppConfigService],
          useFactory: (config: AppConfigService): TypeOrmModuleOptions => {
            const db = config.database;
            const base = {
              host: db.host,
              port: db.port,
              username: db.username,
              password: db.password,
              database: db.database,
              schema: db.schema,
              autoLoadEntities: true,
              logging: config.security.logLevel === 'debug',
              synchronize: config.env !== 'prod', // 로컬/개발에서는 자동 생성, 운영은 별도 마이그레이션 필요
            };

            if (db.vendor === 'postgres') {
              return {
                type: 'postgres',
                ...base,
              };
            }

            if (!db.enabled) {
              return {
                type: 'postgres',
                ...base,
                logging: false,
              };
            }

            // TODO: oracle / mssql / tibero 연결 설정 추가
            throw new Error(`DB vendor "${db.vendor}"는 아직 지원되지 않습니다 (TODO)`);
          },
        }),
        TypeOrmModule.forFeature([UserEntity, RoleEntity, PermissionEntity, MenuEntity]),
      ],
      exports: [TypeOrmModule],
    };
  }
}
