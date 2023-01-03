"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const correlation_module_1 = require("./correlation.module");
describe('Correlation Module', () => {
    let app;
    beforeEach(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [correlation_module_1.CorrelationModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        await app.init();
    });
    it('should be defined', () => {
        expect(app).toBeDefined();
    });
});
