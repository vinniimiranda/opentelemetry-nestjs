import { DynamicModule, Module, Provider } from '@nestjs/common';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import {
  CompositePropagator,
  W3CTraceContextPropagator,
} from '@opentelemetry/core';
import { Resource } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { OpenTelemetryModule } from 'nestjs-otel';
import { MetricService } from './metric.service';
import { TracingService } from './tracing.service';

export interface OtelModuleOptions {
  url: string;
  serviceName: string;
}

@Module({})
export class OtelModule {
  public static async forRootAsync(
    options: OtelModuleOptions,
  ): Promise<DynamicModule> {
    const { url, serviceName } = options;

    const tracingService = new TracingService(url);
    const metricService = new MetricService(url);

    const tracingServiceProvider: Provider = {
      provide: TracingService,
      useValue: tracingService,
    };

    const metricServiceProvider: Provider = {
      provide: MetricService,
      useValue: metricService,
    };
    const exporter = tracingService.getExporter();

    const otelSDK = new NodeSDK({
      traceExporter: exporter,
      spanProcessor: new BatchSpanProcessor(exporter),
      contextManager: new AsyncLocalStorageContextManager(),
      resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
      }),
      textMapPropagator: new CompositePropagator({
        propagators: [new W3CTraceContextPropagator()],
      }),
      instrumentations: [getNodeAutoInstrumentations()],
    });
    await otelSDK.start();

    return {
      module: OtelModule,
      global: true,
      imports: [
        OpenTelemetryModule.forRoot({
          metrics: {
            hostMetrics: false, // Includes Host Metrics
            apiMetrics: {
              enable: true, // Includes api metrics
              defaultAttributes: {
                // You can set default labels for api metrics
                custom: 'label',
              },
              ignoreRoutes: ['/favicon.ico'], // You can ignore specific routes (See https://docs.nestjs.com/middleware#excluding-routes for options)
              ignoreUndefinedRoutes: false, //Records metrics for all URLs, even undefined ones
            },
          },
        }),
      ],
      providers: [tracingServiceProvider, metricServiceProvider],
      exports: [tracingServiceProvider, metricServiceProvider],
    };
  }
}
