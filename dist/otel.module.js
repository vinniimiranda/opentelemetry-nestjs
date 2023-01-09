"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var OtelModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtelModule = void 0;
const common_1 = require("@nestjs/common");
const auto_instrumentations_node_1 = require("@opentelemetry/auto-instrumentations-node");
const context_async_hooks_1 = require("@opentelemetry/context-async-hooks");
const core_1 = require("@opentelemetry/core");
const resources_1 = require("@opentelemetry/resources");
const sdk_node_1 = require("@opentelemetry/sdk-node");
const sdk_trace_base_1 = require("@opentelemetry/sdk-trace-base");
const semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
const nestjs_otel_1 = require("nestjs-otel");
const metric_service_1 = require("./metric.service");
const tracing_service_1 = require("./tracing.service");
let OtelModule = OtelModule_1 = class OtelModule {
    static forRootAsync(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { url, serviceName } = options;
            const tracingService = new tracing_service_1.TracingService(url);
            const metricService = new metric_service_1.MetricService(url);
            const tracingServiceProvider = {
                provide: tracing_service_1.TracingService,
                useValue: tracingService,
            };
            const metricServiceProvider = {
                provide: metric_service_1.MetricService,
                useValue: metricService,
            };
            const exporter = tracingService.getExporter();
            const otelSDK = new sdk_node_1.NodeSDK({
                traceExporter: exporter,
                spanProcessor: new sdk_trace_base_1.BatchSpanProcessor(exporter),
                contextManager: new context_async_hooks_1.AsyncLocalStorageContextManager(),
                resource: new resources_1.Resource({
                    [semantic_conventions_1.SemanticResourceAttributes.SERVICE_NAME]: serviceName,
                }),
                textMapPropagator: new core_1.CompositePropagator({
                    propagators: [new core_1.W3CTraceContextPropagator()],
                }),
                instrumentations: [(0, auto_instrumentations_node_1.getNodeAutoInstrumentations)()],
            });
            yield otelSDK.start();
            return {
                module: OtelModule_1,
                global: true,
                imports: [
                    nestjs_otel_1.OpenTelemetryModule.forRoot({
                        metrics: {
                            hostMetrics: false,
                            apiMetrics: {
                                enable: true,
                                defaultAttributes: {
                                    custom: 'label',
                                },
                                ignoreRoutes: ['/favicon.ico'],
                                ignoreUndefinedRoutes: false,
                            },
                        },
                    }),
                ],
                providers: [tracingServiceProvider, metricServiceProvider],
                exports: [tracingServiceProvider, metricServiceProvider],
            };
        });
    }
};
OtelModule = OtelModule_1 = __decorate([
    (0, common_1.Module)({})
], OtelModule);
exports.OtelModule = OtelModule;
