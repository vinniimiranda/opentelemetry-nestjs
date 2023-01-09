"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricService = void 0;
const common_1 = require("@nestjs/common");
const exporter_metrics_otlp_http_1 = require("@opentelemetry/exporter-metrics-otlp-http");
const sdk_metrics_1 = require("@opentelemetry/sdk-metrics");
let MetricService = class MetricService {
    constructor(url) {
        this._exporter = new exporter_metrics_otlp_http_1.OTLPMetricExporter({
            url: `${url}/v1/metrics`,
        });
        this.init();
    }
    init() {
        this.meterProvider = new sdk_metrics_1.MeterProvider({});
        this.meterProvider.addMetricReader(new sdk_metrics_1.PeriodicExportingMetricReader({
            exporter: this._exporter,
            exportIntervalMillis: 1000,
        }));
    }
    getMeter(name) {
        if (!this.meterProvider) {
            this.init();
        }
        return this.meterProvider.getMeter(name);
    }
};
MetricService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [String])
], MetricService);
exports.MetricService = MetricService;
