import {
  DynamicModule,
  Injectable,
  Module,
  OnModuleInit,
  Provider,
} from '@nestjs/common';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import {
  CompositePropagator,
  W3CTraceContextPropagator,
} from '@opentelemetry/core';
import { Resource } from '@opentelemetry/resources';
import { NodeSDK, NodeSDKConfiguration } from '@opentelemetry/sdk-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { OpenTelemetryModule as OtelModule } from 'nestjs-otel';
import {
  OPEN_TELEMETRY_MODULE_CONFIG_TOKEN,
  OPEN_TELEMETRY_MODULE_OPTIONS,
} from './constants';
import { InjectOpenTelemetryModuleConfig } from './decorators';
import { getOpenTelemetryModuleOptions } from './helpers';
import {
  OpenTelemetryModuleAsyncOptions,
  OpenTelemetryModuleFactory,
  OpenTelemetryModuleOptions,
} from './interfaces';
import { MetricService, TracingService } from './services';

@Injectable()
class SDK implements OnModuleInit {
  private sdk: NodeSDK;
  private configuration: NodeSDKConfiguration = Object.assign({});
  constructor(
    @InjectOpenTelemetryModuleConfig()
    private readonly config: OpenTelemetryModuleOptions,
    private readonly tracingService: TracingService,
  ) {}
  async onModuleInit() {
    const { useTracing, serviceName, useLogging, useMetric } = this.config;
    this.configuration.contextManager = new AsyncLocalStorageContextManager();
    this.configuration.resource = new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    });
    this.configuration.textMapPropagator = new CompositePropagator({
      propagators: [new W3CTraceContextPropagator()],
    });
    this.configuration.instrumentations = [getNodeAutoInstrumentations()];

    if (useTracing) {
      const exporter = this.tracingService.getExporter();
      this.configuration.traceExporter = exporter;
      this.configuration.spanProcessor = new BatchSpanProcessor(exporter);
    }

    try {
      this.sdk = new NodeSDK(this.configuration);
      await this.sdk.start();
    } catch (error) {
      throw new Error(`Unable to start open telemetry SDK`);
    }
  }
}

@Module({})
export class OpenTelemetryModule {
  public static async forRootAsync(
    options: OpenTelemetryModuleAsyncOptions,
  ): Promise<DynamicModule> {
    const provider: Provider = {
      inject: [OPEN_TELEMETRY_MODULE_OPTIONS],
      provide: OPEN_TELEMETRY_MODULE_CONFIG_TOKEN,
      useFactory: async (options: OpenTelemetryModuleOptions) =>
        getOpenTelemetryModuleOptions(options),
    };

    const providers = [
      ...this.createAsyncProviders(options),
      provider,
      SDK,
      TracingService,
      MetricService,
    ];

    return {
      module: OpenTelemetryModule,
      global: true,
      imports: [
        ...(options.imports || []),
        OtelModule.forRoot({
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
      providers,
      exports: [...providers],
    };
  }

  private static createAsyncProviders(
    options: OpenTelemetryModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: OpenTelemetryModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: OPEN_TELEMETRY_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    const inject = [options.useClass || options.useExisting];

    return {
      provide: OPEN_TELEMETRY_MODULE_OPTIONS,
      useFactory: async (optionsFactory: OpenTelemetryModuleFactory) =>
        await optionsFactory.createOpenTelemetryModuleOptions(),
      inject,
    };
  }
}
