import { createMock } from '@golevelup/nestjs-testing';
import { Request } from 'express';
import { CorrelationService } from './correlation-service';

describe('Correlation Service', () => {
  it('should return correlation when present in headers', () => {
    const mockRequest = createMock<Request>({
      headers: {
        'x-correlation-id': 'correlation',
      },
    });
    const correlationService = new CorrelationService(mockRequest);
    expect(correlationService.correlationId).toBe('correlation');
  });
  it('should return a new correlation when NOT present in headers', () => {
    const mockRequest = createMock<Request>();
    const correlationService = new CorrelationService(mockRequest);
    expect(correlationService.correlationId).toBeDefined();
  });
});
