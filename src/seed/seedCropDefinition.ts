// src/seed/seedCropDefinitions.ts
import mongoose from "mongoose";
import { CropDefinition } from "../models/CropDefinition";
import { cropDefinitionSeeds } from "./cropDefinitions.data";
import { env } from "../config/env";

export const seedCropDefinitions = async () => {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(env.mongoUri);

  console.log("Seeding CropDefinitions...");

  if (!cropDefinitionSeeds.length) {
    console.log("No crop definitions to seed.");
    await mongoose.disconnect();
    return;
  }

  const ops = cropDefinitionSeeds.map((seed) => ({
    updateOne: {
      filter: { code: seed.code },
      update: { $set: seed },
      upsert: true
    }
  }));

  await CropDefinition.bulkWrite(ops);
  console.log(`Seeded/updated ${ops.length} crop definitions.`);

  await mongoose.disconnect();
  console.log("Done.");
};

// Allow direct CLI execution: `ts-node src/seed/seedCropDefinitions.ts` or compiled JS with node
if (require.main === module) {
  seedCropDefinitions()
    .catch((err) => {
      console.error("Error seeding crop definitions:", err);
      process.exit(1);
    })
    .then(() => process.exit(0));
}
