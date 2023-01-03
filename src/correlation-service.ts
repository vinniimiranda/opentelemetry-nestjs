import { Global, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { randomUUID } from 'crypto';
import { Request } from 'express';

@Global()
export class CorrelationService {
  private _correlationId: string;
  constructor(@Inject(REQUEST) private readonly request: Request) {
    if (this.request.headers && this.request.headers['x-correlation-id']) {
      this._correlationId = this.request.headers['x-correlation-id'] as string;
    } else {
      this._correlationId = randomUUID();
    }
  }

  get correlationId(): string {
    return this._correlationId;
  }
}
