import * as metrics from '@opentelemetry/api-metrics';
import { MeterProvider } from '@opentelemetry/sdk-metrics';
export declare class MetricService {
    private readonly _exporter;
    meterProvider: MeterProvider;
    constructor(url: string);
    init(): void;
    getMeter(name: string): metrics.Meter;
}
