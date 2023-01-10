import { Provider } from '@nestjs/common';
import { OPEN_TELEMETRY_MODULE_CONFIG_TOKEN } from '../constants';
import { OpenTelemetryModuleOptions } from '../interfaces';
import { getOpenTelemetryModuleOptions } from './get-open-telemetry-module-options.helper';

export function createOpenTelemetryProvider(
  options: OpenTelemetryModuleOptions,
): Provider {
  return {
    provide: OPEN_TELEMETRY_MODULE_CONFIG_TOKEN,
    useValue: getOpenTelemetryModuleOptions(options),
  };
}
