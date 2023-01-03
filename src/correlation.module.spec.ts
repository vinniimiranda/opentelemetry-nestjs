import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CorrelationModule } from './correlation.module';

describe('Correlation Module', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CorrelationModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  it('should be defined', () => {
    expect(app).toBeDefined();
  });
});
