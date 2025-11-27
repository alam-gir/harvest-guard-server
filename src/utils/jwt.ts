import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export type JwtRole = "farmer";

interface JwtBasePayload {
  sub: string;
  sessionId: string;
  role: JwtRole;
}

export interface AccessTokenPayload extends JwtBasePayload {
  type: "access";
}

export interface RefreshTokenPayload extends JwtBasePayload {
  type: "refresh";
}

const ACCESS_ISSUER = "harvest-guard-backend";
const REFRESH_ISSUER = "harvest-guard-backend";

const accessTokenOptions: SignOptions = {
  expiresIn: env.jwt.accessTokenTtl as any,
  issuer: ACCESS_ISSUER,
};

const refreshTokenOptions: SignOptions = {
  expiresIn: env.jwt.refreshTokenTtl as any,
  issuer: REFRESH_ISSUER
};

export const signAccessToken = (payload: JwtBasePayload): string => {
  const fullPayload: AccessTokenPayload = {
    ...payload,
    type: "access"
  };

  return jwt.sign(fullPayload, env.jwt.accessTokenSecret, accessTokenOptions);
};

export const signRefreshToken = (payload: JwtBasePayload): string => {
  const fullPayload: RefreshTokenPayload = {
    ...payload,
    type: "refresh"
  };

  return jwt.sign(fullPayload, env.jwt.refreshTokenSecret, refreshTokenOptions);
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  const decoded = jwt.verify(token, env.jwt.accessTokenSecret) as AccessTokenPayload;

  if (decoded.type !== "access") {
    throw new Error("Invalid access token type");
  }

  return decoded;
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  const decoded = jwt.verify(token, env.jwt.refreshTokenSecret) as RefreshTokenPayload;

  if (decoded.type !== "refresh") {
    throw new Error("Invalid refresh token type");
  }

  return decoded;
};
