<h1 align="center">Nest.js Correlation ID</h1>

<div align="center">
  <a href="https://nestjs.com" target="_blank">
    <img src="https://img.shields.io/badge/built%20with-NestJs-red.svg" alt="Built with NestJS">
  </a>
</div>

### Why?

When debugging an issue in your applications logs, it helps to be able to follow a specific request up and down your whole stack. This is usually done by including a `correlation-id` (aka `Request-id`) header in all your requests, and forwarding the same id across all your microservices.

### Installation

```bash
yarn add bankly-correlation-id-nestjs
```

```bash
npm install bankly-correlation-id-nestjs
```

### How to use

Add the middleware to your `AppModule`

```ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import {
  CorrelationIdMiddleware,
  CorrelationModule,
} from 'bankly-correlation-id-nestjs';

@Module({
  imports: [CorrelationModule.forRoot()],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
```

You can pass the correlation through several layers of your application since http requests, kafka publisher events, queues, jobs and many others, all you have to do is  inject the  `CorrelationService` into your `Class` and use the `correlationId` property.

```ts
import { Injectable, Logger } from '@nestjs/common';
import { HealthCheck } from '@nestjs/terminus';
import { CorrelationService } from 'nestjs-correlation-id';

@Injectable()
export class UserService {
  constructor(private readonly correlationService: CorrelationService) {}

  public async execute() {
    Logger.log(`I am using the correlationId: ${this.correlationService.correlationId}`);
    return ...
  }
}

export default UserService;
```

