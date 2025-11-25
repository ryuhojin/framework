import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health', () => {
    it('should return ok status with version', () => {
      const health = appController.getHealth();
      expect(health.status).toBe('ok');
      expect(health.version).toBeDefined();
    });
  });

  describe('info', () => {
    it('should return api info', () => {
      const info = appController.getInfo();
      expect(info.name.length).toBeGreaterThan(0);
      expect(info.description.length).toBeGreaterThan(0);
    });
  });
});
