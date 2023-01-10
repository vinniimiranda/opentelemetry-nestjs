import { Inject } from '@nestjs/common';
import { OPEN_TELEMETRY_MODULE_OPTIONS } from '../constants';
import { OpenTelemetryModuleOptions } from '../interfaces';

export class OpenTelemetryService implements OpenTelemetryModuleOptions {
  url: string;
  serviceName: string;
  useMetric: boolean;
  useTracing: boolean;
  useLog: boolean;

  constructor(
    @Inject(OPEN_TELEMETRY_MODULE_OPTIONS)
    private readonly config?: OpenTelemetryModuleOptions,
  ) {
    this.serviceName = config.serviceName;
    this.url = config.url;
  }
}
