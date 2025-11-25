import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigService } from './config/app-config.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: AppConfigService,
          useValue: { env: 'local' },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('info', () => {
    it('should return api info', () => {
      const response = appController.getInfo();
      expect(response.success).toBe(true);
      expect(response.data?.name.length).toBeGreaterThan(0);
      expect(response.data?.description.length).toBeGreaterThan(0);
    });
  });
});
