import { Injectable } from '@nestjs/common';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { InjectOpenTelemetryModuleConfig } from '../decorators';
import { OpenTelemetryModuleOptions } from '../interfaces';

@Injectable()
export class TracingService {
  private readonly _exporter: OTLPTraceExporter;

  constructor(
    @InjectOpenTelemetryModuleConfig()
    private readonly config: OpenTelemetryModuleOptions,
  ) {
    this._exporter = new OTLPTraceExporter({
      url: `${this.config.url}/v1/traces`,
    });
  }

  getExporter(): OTLPTraceExporter {
    return this._exporter;
  }
}
