import dotenv from "dotenv";
dotenv.config();

const required = (value: string | undefined, name: string): string => {
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
};

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "4000", 10),
  mongoUri: required(process.env.MONGO_URI, "MONGO_URI"),
  
  jwt: {
    accessTokenSecret: required(process.env.ACCESS_TOKEN_SECRET, "ACCESS_TOKEN_SECRET"),
    refreshTokenSecret: required(process.env.REFRESH_TOKEN_SECRET, "REFRESH_TOKEN_SECRET"),
    accessTokenTtl: process.env.ACCESS_TOKEN_TTL || "15m",
    refreshTokenTtl: process.env.REFRESH_TOKEN_TTL || "30d"
  }
};
