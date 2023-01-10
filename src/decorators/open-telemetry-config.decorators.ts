import { Inject } from '@nestjs/common';
import { OPEN_TELEMETRY_MODULE_CONFIG_TOKEN } from '../constants';

export function InjectOpenTelemetryModuleConfig() {
  return Inject(OPEN_TELEMETRY_MODULE_CONFIG_TOKEN);
}
