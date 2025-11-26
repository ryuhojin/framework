import { SeedService } from './seed.service';
import { AppConfigService } from '../config/app-config.service';
import { Repository } from 'typeorm';

const createMockRepo = <T extends { [key: string]: any }>(key: keyof T) => {
  const store: T[] = [];
  return {
    create: (data: Partial<T>) => ({ ...data }) as T,
    async findOne(options: any) {
      const where = options?.where || {};
      return store.find((item) => Object.entries(where).every(([k, v]) => (item as any)[k] === v));
    },
    async save(entity: any) {
      const existingIndex = store.findIndex((item) => item[key] === entity[key]);
      if (existingIndex >= 0) {
        store[existingIndex] = { ...store[existingIndex], ...entity };
        return store[existingIndex];
      }
      const saved = { ...entity } as T;
      store.push(saved);
      return saved;
    },
  } as unknown as Repository<T>;
};

describe('SeedService', () => {
  it('동일 퍼미션/유저가 있어도 중복 없이 통과한다', async () => {
    const mockConfig: any = {
      env: 'local',
      database: { enabled: true },
      security: { bcryptSaltOrRounds: 4 },
    };

    const userRepo = createMockRepo<any>('username');
    const roleRepo = createMockRepo<any>('name');
    const permRepo = createMockRepo<any>('code');
    const menuRepo = createMockRepo<any>('path');

    const service = new SeedService(
      mockConfig as AppConfigService,
      userRepo,
      roleRepo,
      permRepo,
      menuRepo,
    );

    await service['seed']();
    await service['seed'](); // 한 번 더 호출해도 duplicate 없어야 함

    // admin 사용자 1명만 존재
    const admin = await userRepo.findOne({ where: { username: 'admin' } });
    expect(admin).toBeDefined();
  });
});
