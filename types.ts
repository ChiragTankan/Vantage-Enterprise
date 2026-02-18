
export enum AppMode {
  QUICK_CONSULT = 'QUICK_CONSULT',
  DEEP_ANALYSIS = 'DEEP_ANALYSIS'
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface SystemTelemetry {
  precisionLevel: string;
  relevanceScore: number;
  processingTime: number;
}

export interface InsightReport {
  content: string;
  strategyReference: string;
  telemetry: SystemTelemetry;
  sources?: GroundingSource[];
}
