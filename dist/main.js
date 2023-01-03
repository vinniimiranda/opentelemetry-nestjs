"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const correlation_middleware_1 = require("./correlation.middleware");
const correlation_module_1 = require("./correlation.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(correlation_module_1.CorrelationModule);
    app.use(app.get(correlation_middleware_1.CorrelationIdMiddleware).use);
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map