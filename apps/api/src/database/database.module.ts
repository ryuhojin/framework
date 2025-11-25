import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppConfigService } from '../config/app-config.service';
import { UserEntity } from './entities/user.entity';

const dbDisabled = (): boolean => process.env.DB_DISABLE === 'true';

@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    if (dbDisabled()) {
      return { module: DatabaseModule, providers: [], exports: [] };
    }

    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          inject: [AppConfigService],
          useFactory: (config: AppConfigService): TypeOrmModuleOptions => {
            const db = config.database;
            if (!db.enabled) {
              return {
                type: 'postgres',
                host: db.host,
                port: db.port,
                username: db.username,
                password: db.password,
                database: db.database,
                schema: db.schema,
                autoLoadEntities: true,
                synchronize: false,
                logging: false,
              };
            }

            if (db.vendor === 'postgres') {
              return {
                type: 'postgres',
                host: db.host,
                port: db.port,
                username: db.username,
                password: db.password,
                database: db.database,
                schema: db.schema,
                autoLoadEntities: true,
                synchronize: false,
                logging: config.security.logLevel === 'debug',
              };
            }

            // TODO: oracle / mssql / tibero 연결 설정 추가
            throw new Error(`DB vendor "${db.vendor}"는 아직 지원되지 않습니다 (TODO)`);
          },
        }),
        TypeOrmModule.forFeature([UserEntity]),
      ],
      exports: [TypeOrmModule],
    };
  }
}
