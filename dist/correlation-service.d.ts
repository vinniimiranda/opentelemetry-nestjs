import { Request } from 'express';
export declare class CorrelationService {
    private readonly request;
    private _correlationId;
    constructor(request: Request);
    get correlationId(): string;
}
