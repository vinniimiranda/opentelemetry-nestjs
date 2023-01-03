import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
export declare const IGNORED_PATHS: RegExp[];
export declare const shouldIgnorePath: (requestPath: string) => boolean;
export declare class CorrelationIdMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction): void;
}
