<h1 align="center">ID de correlação Nest.js</h1>

<div align="center">
   <a href="https://nestjs.com" target="_blank">
     <img src="https://img.shields.io/badge/built%20with-NestJs-red.svg" alt="Construído com NestJS">
   </a>
</div>

### Por que?

Ao debugar um problema nos logs de seus aplicativos, é útil poder acompanhar uma solicitação específica por toda a pilha. Isso geralmente é feito incluindo um cabeçalho `correlation-id` (também conhecido como `Request-id`) em todas as suas solicitações e encaminhando o mesmo id em todos os seus microsserviços.

### Instalação

```bash
yarn add bankly-correlation-id-nestjs
```

```bash
npm install bankly-correlation-id-nestjs
```

### Como usar

Adicione o middleware ao seu `AppModule`

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

Você pode passar o `correlationId` por várias camadas da sua aplicação desde requisições http, kafka publisher events, queues, jobs e muitos outros, tudo que você tem que fazer é injetar o `CorrelationService` na sua classe `Class` e usar a propriedade `correlationId`.

```ts
import { Injectable, Logger } from '@nestjs/common';
import { HealthCheck } from '@nestjs/terminus';
import { CorrelationService } from 'nestjs-correlation-id';

@Injectable()
export class UserService {
   construtor(private readonly correlationService: CorrelationService) {}

   public async execute() {
     Logger.log(`Estou usando o correlationId: ${this.correlationService.correlationId}`);
     return ...
   }
}
```
