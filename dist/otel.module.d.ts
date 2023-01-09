import { DynamicModule } from '@nestjs/common';
export interface OtelModuleOptions {
    url: string;
    serviceName: string;
}
export declare class OtelModule {
    static forRootAsync(options: OtelModuleOptions): Promise<DynamicModule>;
}
