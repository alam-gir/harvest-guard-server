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
  },

  cookie: {
    domain: process.env.COOKIE_DOMAIN || undefined,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: (process.env.COOKIE_SAMESITE as "lax" | "strict" | "none") || "lax"
  },

  ai: {
    geminiApiKey: required(process.env.GEMINI_API_KEY, "GEMINI_API_KEY")
  },

  r2: {
    accessKeyId: required(process.env.R2_ACCESS_KEY_ID, "R2_ACCESS_KEY_ID"),
    secretAccessKey: required(process.env.R2_SECRET_ACCESS_KEY, "R2_SECRET_ACCESS_KEY"),
    endpoint: required(process.env.R2_ENDPOINT, "R2_ENDPOINT"),
    bucket: required(process.env.R2_BUCKET, "R2_BUCKET"),
    publicUrl: required(process.env.R2_PUBLIC_URL, "R2_PUBLIC_URL")
  }
};
