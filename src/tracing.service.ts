import { Injectable } from '@nestjs/common';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

@Injectable()
export class TracingService {
  private readonly _exporter: OTLPTraceExporter;

  constructor(url: string) {
    this._exporter = new OTLPTraceExporter({
      url: `${url}/v1/traces`,
    });
  }

  getExporter(): OTLPTraceExporter {
    return this._exporter;
  }
}
