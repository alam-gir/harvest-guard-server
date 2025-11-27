import { createApp } from "./app";
import { env } from "./config/env";
import { connectDb } from "./config/db";

const start = async () => {
  try {
    await connectDb();

    const app = createApp();

    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port} (${env.nodeEnv})`);
    });
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
};

start();
