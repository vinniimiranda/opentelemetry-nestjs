import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Attributes } from '@opentelemetry/api';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { InjectOpenTelemetryModuleConfig } from '../decorators';
import { OpenTelemetryModuleOptions } from '../interfaces';
import { MetricService } from '../services/metric.service';

interface HttpMeterAttributes extends Attributes {
  http_method: string;
  http_route: string;
  http_status_code: number;
  http_status_code_family: string;
  'x-company-key': string;
  job: string;
}
@Injectable()
export class MetricInterceptor implements NestInterceptor {
  constructor(
    @InjectOpenTelemetryModuleConfig()
    private readonly config: OpenTelemetryModuleOptions,
    private readonly metric: MetricService,
  ) {}
  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response> {
    const start = new Date();
    const meter = this.metric.getMeter('http requests');
    const httpMeter = meter.createHistogram<HttpMeterAttributes>(
      'bankly_http_request_elapsed_time',
    );
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const HEALTH_PATHS = ['/hc', '/liveness'];
    if (HEALTH_PATHS.includes(request.path)) {
      return next.handle();
    }
    response.on('finish', async () => {
      const data = context.switchToHttp().getResponse<Response>();

      const attributes: HttpMeterAttributes = {
        'x-company-key': request.headers['x-company-key'] as string,
        http_method: request.method,
        http_route: request.route.path,
        http_status_code: data.statusCode,
        http_status_code_family: String(data.statusCode)
          .slice(0, 1)
          .padEnd(3, '0'),
        job: this.config.serviceName,
      };
      const end = new Date();
      const elapsedTime = end.getTime() - start.getTime();
      httpMeter.record(elapsedTime, attributes);
    });

    return next.handle();
  }
}
