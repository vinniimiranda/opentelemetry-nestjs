import { DynamicModule, Module } from '@nestjs/common';
import { CorrelationService } from './correlation-service';

@Module({})
export class CorrelationModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: CorrelationModule,
      providers: [CorrelationService],
      exports: [CorrelationService],
    };
  }
}
