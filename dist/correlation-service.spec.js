"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nestjs_testing_1 = require("@golevelup/nestjs-testing");
const correlation_service_1 = require("./correlation-service");
describe('Correlation Service', () => {
    it('should return correlation when present in headers', () => {
        const mockRequest = (0, nestjs_testing_1.createMock)({
            headers: {
                'x-correlation-id': 'correlation',
            },
        });
        const correlationService = new correlation_service_1.CorrelationService(mockRequest);
        expect(correlationService.correlationId).toBe('correlation');
    });
    it('should return a new correlation when NOT present in headers', () => {
        const mockRequest = (0, nestjs_testing_1.createMock)();
        const correlationService = new correlation_service_1.CorrelationService(mockRequest);
        expect(correlationService.correlationId).toBeDefined();
    });
});
