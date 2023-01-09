import { Controller, Get, Module } from '@nestjs/common';
import { Span } from 'nestjs-otel';
import { OtelModule } from '../src/otel.module';

@Controller()
export class Default {
  @Get()
  @Span('GetOk')
  async get() {
    return {
      status: 'Ok!',
    };
  }
}

@Module({
  imports: [
    OtelModule.forRootAsync({
      serviceName: 'template-otel',
      url: 'http://otel-http.kube.acesso-sdb.aws',
    }),
  ],
  controllers: [Default],
})
export class AppModule {}
