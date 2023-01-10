import { Injectable } from '@nestjs/common';
import * as metrics from '@opentelemetry/api-metrics';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import {
  MeterProvider,
  PeriodicExportingMetricReader,
} from '@opentelemetry/sdk-metrics';
import { InjectOpenTelemetryModuleConfig } from '../decorators';
import { OpenTelemetryModuleOptions } from '../interfaces';

@Injectable()
export class MetricService {
  private readonly _exporter: OTLPMetricExporter;
  public meterProvider: MeterProvider;

  constructor(
    @InjectOpenTelemetryModuleConfig()
    private readonly config: OpenTelemetryModuleOptions,
  ) {
    this._exporter = new OTLPMetricExporter({
      url: `${this.config.url}/v1/metrics`,
    });
    this.init();
  }
  init() {
    this.meterProvider = new MeterProvider({});
    this.meterProvider.addMetricReader(
      new PeriodicExportingMetricReader({
        exporter: this._exporter,
        exportIntervalMillis: 10000,
      }),
    );
  }

  public getMeter(name: string): metrics.Meter {
    if (!this.meterProvider) {
      this.init();
    }

    return this.meterProvider.getMeter(name);
  }
}
