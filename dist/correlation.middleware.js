"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorrelationIdMiddleware = exports.shouldIgnorePath = exports.IGNORED_PATHS = void 0;
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
exports.IGNORED_PATHS = [/hc$/, /liveness$/, /swagger/m, /queues/m];
const shouldIgnorePath = (requestPath) => {
    return exports.IGNORED_PATHS.some((hp) => hp.test(requestPath));
};
exports.shouldIgnorePath = shouldIgnorePath;
let CorrelationIdMiddleware = class CorrelationIdMiddleware {
    use(req, res, next) {
        if ((0, exports.shouldIgnorePath)(req.path)) {
            return next();
        }
        const correlationKeys = [
            'Correlation-Id',
            'X-Correlation-Id',
            'x-correlation-id',
        ];
        const headers = req.headers;
        let correlationId;
        for (const header in headers) {
            if (correlationKeys.includes(header)) {
                correlationId = headers[header];
                delete headers[header];
                break;
            }
        }
        if (!correlationId) {
            correlationId = crypto.randomUUID();
            req.headers['x-correlation-id'] = correlationId;
        }
        else {
            req.headers['x-correlation-id'] = correlationId;
        }
        res.setHeader('x-correlation-id', correlationId);
        next();
    }
};
CorrelationIdMiddleware = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Injectable)()
], CorrelationIdMiddleware);
exports.CorrelationIdMiddleware = CorrelationIdMiddleware;
