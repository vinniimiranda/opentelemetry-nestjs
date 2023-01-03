import { Module } from '@nestjs/common';
import { CorrelationService } from './correlation-service';
import { CorrelationIdMiddleware } from './correlation.middleware';

@Module({
  providers: [CorrelationIdMiddleware, CorrelationService],
  exports: [CorrelationIdMiddleware, CorrelationService],
})
export class CorrelationModule {}
