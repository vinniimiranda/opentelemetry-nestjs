import { OpenTelemetryModuleOptions } from '../interfaces';
import { OpenTelemetryService } from '../services/open-telemetry.service';

export const getOpenTelemetryModuleOptions = (
  options: OpenTelemetryModuleOptions,
): OpenTelemetryService => new OpenTelemetryService(options);
