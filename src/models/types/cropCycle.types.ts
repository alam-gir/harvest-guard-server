export interface CreateCropCycleInput {
  farmerId: string;
  cropDefinitionCode: string;      // e.g. "paddy_aman"
  varietyName?: string;            // e.g. "BRRI-28"
  fieldName?: string;
  fieldAreaDecimal?: number;       // area in decimal
  startMode: "planning" | "planted" | "harvested";
  startDate?: string;              // ISO date from frontend, optional
}

export interface UpdateStageInput {
  farmerId: string;
  cropCycleId: string;
  newStage: "planted" | "harvested" | "stored" | "completed";
  date?: string; // optional override date
}