import { Controller, Get, Injectable, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Span } from 'nestjs-otel';
import { MetricInterceptor, TracingInterceptor } from '../src/interceptors/';
import { OtelModule } from '../src/otel.module';

@Injectable()
export class HealthService {
  @Span('service - validate status', {})
  callOnMe() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(true);
      }, 3000);
    });
  }
}

@Controller('api/v1')
class Default {
  constructor(private readonly callme: HealthService) {}
  @Get('/customer/:id')
  async handle() {
    return this.callme.callOnMe();
  }
}

@Module({
  imports: [
    OtelModule.forRootAsync({
      serviceName: 'template-otel',
      url: 'http://otel-http.kube.acesso-sdb.aws',
      useLog: true,
      useMetric: true,
      useTracing: true,
    }),
  ],
  controllers: [Default],
  providers: [
    HealthService,
    TracingInterceptor,
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricInterceptor,
    },
  ],
})
export class AppModule {}
