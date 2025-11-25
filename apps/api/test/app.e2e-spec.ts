process.env.DB_DISABLE = 'true';
process.env.APP_ENV = 'local';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET health)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body.data.status).toBeDefined();
        expect(res.body.data.db).toBe('disabled');
      });
  });

  it('/info (GET)', () => {
    return request(app.getHttpServer())
      .get('/info')
      .expect(200)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body.data.name).toBeDefined();
        expect(res.body.data.description).toBeDefined();
      });
  });
});
