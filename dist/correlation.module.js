"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorrelationModule = void 0;
const common_1 = require("@nestjs/common");
const correlation_service_1 = require("./correlation-service");
const correlation_middleware_1 = require("./correlation.middleware");
let CorrelationModule = class CorrelationModule {
};
CorrelationModule = __decorate([
    (0, common_1.Module)({
        providers: [correlation_middleware_1.CorrelationIdMiddleware, correlation_service_1.CorrelationService],
        exports: [correlation_middleware_1.CorrelationIdMiddleware, correlation_service_1.CorrelationService],
    })
], CorrelationModule);
exports.CorrelationModule = CorrelationModule;
//# sourceMappingURL=correlation.module.js.map