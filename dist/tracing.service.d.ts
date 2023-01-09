import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
export declare class TracingService {
    private readonly _exporter;
    constructor(url: string);
    getExporter(): OTLPTraceExporter;
}
