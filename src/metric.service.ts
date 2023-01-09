import { Injectable } from '@nestjs/common';
import * as metrics from '@opentelemetry/api-metrics';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import {
  MeterProvider,
  PeriodicExportingMetricReader,
} from '@opentelemetry/sdk-metrics';

@Injectable()
export class MetricService {
  private readonly _exporter: OTLPMetricExporter;
  public meterProvider: MeterProvider;

  constructor(url: string) {
    this._exporter = new OTLPMetricExporter({
      url: `${url}/v1/metrics`,
    });
    this.init();
  }
  init() {
    this.meterProvider = new MeterProvider({});
    this.meterProvider.addMetricReader(
      new PeriodicExportingMetricReader({
        exporter: this._exporter,
        exportIntervalMillis: 1000,
      }),
    );
    // this.meterProvider.forceFlush();
  }

  public getMeter(name: string): metrics.Meter {
    if (!this.meterProvider) {
      this.init();
    }

    return this.meterProvider.getMeter(name);
  }
}
