import { Controller, Get, Injectable, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Span } from 'nestjs-otel';
import { MetricInterceptor, TracingInterceptor } from '../src/interceptors/';
import { OpenTelemetryModule } from '../src/open-telemetry.module';
@Injectable()
export class HealthService {
  @Span('service - validate status', {})
  callOnMe() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  }
}

@Controller('api/v1')
class Default {
  constructor(private readonly callme: HealthService) {}
  @Span('controller')
  @Get('/customer/:id')
  async handle() {
    // throw new ConflictException('testes');
    return this.callme.callOnMe();
  }
}

@Module({
  imports: [
    OpenTelemetryModule.forRootAsync({
      useFactory: async () => {
        return {
          serviceName: 'x-teste--sdk',
          url: 'http://otel-http.kube.acesso-sdb.aws',
          useLogging: true,
          useMetric: true,
          useTracing: true,
        };
      },
    }),
  ],
  controllers: [Default],
  providers: [
    HealthService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TracingInterceptor,
    },
  ],
})
export class AppModule {}
