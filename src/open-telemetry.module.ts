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
import { NodeSDK } from '@opentelemetry/sdk-node';
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
  constructor(
    @InjectOpenTelemetryModuleConfig()
    private readonly config: OpenTelemetryModuleOptions,
    private readonly tracingService: TracingService,
  ) {}
  async onModuleInit() {
    const exporter = this.tracingService.getExporter();
    const otelSDK = new NodeSDK({
      traceExporter: exporter,
      spanProcessor: new BatchSpanProcessor(exporter),
      contextManager: new AsyncLocalStorageContextManager(),
      resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: this.config.serviceName,
      }),
      textMapPropagator: new CompositePropagator({
        propagators: [new W3CTraceContextPropagator()],
      }),
      instrumentations: [getNodeAutoInstrumentations()],
    });
    try {
      await otelSDK.start();
      console.log('SDK Inicializado');
    } catch (error) {
      console.log(error);
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
      imports: [
        ...(options.imports || []),
        OtelModule.forRoot({
          metrics: {
            hostMetrics: true, // Includes Host Metrics
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
