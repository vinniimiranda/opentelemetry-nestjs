import { ModuleMetadata, Type } from '@nestjs/common';

export interface OpenTelemetryModuleOptions {
  url: string;
  serviceName: string;
  useMetric: boolean;
  useTracing: boolean;
  useLogging: boolean;
}

export interface OpenTelemetryModuleFactory {
  createOpenTelemetryModuleOptions: () =>
    | Promise<OpenTelemetryModuleOptions>
    | OpenTelemetryModuleOptions;
}

export interface OpenTelemetryModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useClass?: Type<OpenTelemetryModuleFactory>;
  useExisting?: Type<OpenTelemetryModuleFactory>;
  useFactory: (
    ...args: any[]
  ) => Promise<OpenTelemetryModuleOptions> | OpenTelemetryModuleOptions;
}
