import { CropLifecycleStage } from "../CropCycle";

export interface CreateCropCycleInput {
  farmerId: string;
  cropDefinitionCode: string;      // e.g. "paddy_aman"
  varietyName?: string;            // e.g. "BRRI-28"
  fieldName?: string;
  fieldAreaDecimal?: number;       // area in decimal
  startMode: CropLifecycleStage;
  startDate?: string;              // ISO date from frontend, optional
}

export interface UpdateStageInput {
  farmerId: string;
  cropCycleId: string;
  newStage: CropLifecycleStage;
  date?: string; // optional override date
}

export interface StartStorageInput {
  farmerId: string;
  cropCycleId: string;

  storageType: string;

  storageLocation?: {
    division?: string;
    district?: string;
    upazila?: string;
    description?: string;
  };

  estimatedWeightKg?: number;
  currentMoisturePercent?: number;
  storageStartedAt?: string | Date;
}

export interface UpdateStorageInput {
  farmerId: string;
  cropCycleId: string;

  storageType?: string;
  storageLocation?: {
    division?: string;
    district?: string;
    upazila?: string;
    description?: string;
  };

  estimatedWeightKg?: number;
  currentMoisturePercent?: number;
}

export interface CompleteStorageInput {
  farmerId: string;
  cropCycleId: string;

  finalWeightKg?: number;
  storageEndAt?: string | Date;
}