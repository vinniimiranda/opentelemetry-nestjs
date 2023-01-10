import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Scope,
} from '@nestjs/common';
import opentelemetry, { Attributes } from '@opentelemetry/api';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { InjectOpenTelemetryModuleConfig } from '../decorators';
import { OpenTelemetryModuleOptions } from '../interfaces';

interface HttpTracigAttributes extends Attributes {
  http_method: string;
  http_route: string;
  http_status_code?: number;
  http_status_code_family?: string;
  'x-company-key': string;
  job: string;
}

@Injectable({ scope: Scope.REQUEST })
export class TracingInterceptor implements NestInterceptor {
  constructor(
    @InjectOpenTelemetryModuleConfig()
    private readonly config: OpenTelemetryModuleOptions,
  ) {}
  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response> {
    const tracer = opentelemetry.trace.getTracer('http-tracing-middleware');

    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const span = tracer.startSpan('controller - ' + request.route.path, {});

    const HEALTH_PATHS = ['/hc', '/liveness'];
    if (HEALTH_PATHS.includes(request.path)) {
      return next.handle();
    }

    response.on('finish', async () => {
      const data = context.switchToHttp().getResponse<Response>();
      const attributes: HttpTracigAttributes = {
        'x-company-key': request.headers['x-company-key'] as string,
        'x-correlation-id': request.headers['x-correlation-id'] as string,
        http_method: request.method,
        http_route: request.route.path,
        http_status_code: data.statusCode,
        http_status_code_family: String(data.statusCode)
          .slice(0, 1)
          .padEnd(3, '0'),
        job: this.config.serviceName,
      };
      span.setAttributes(attributes);
      span.end();
    });

    return next.handle();
  }
}
