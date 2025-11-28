import { AiHealthScanRequest, AiHealthScanResult, AiProviderName } from "./ai.types";

export interface AiClient {
  provider: AiProviderName;

  analyzeHealthScan(input: AiHealthScanRequest): Promise<AiHealthScanResult>;
}
