import { Response } from "express";
import { env } from "../config/env";
import ms from "ms";

interface AuthCookiesOptions {
  accessToken: string;
  refreshToken: string;
}

export const setAuthCookies = (res: Response, tokens: AuthCookiesOptions) => {
  const { accessToken, refreshToken } = tokens;

  // Convert TTL strings ("15m", "30d") into milliseconds for cookie maxAge
  const accessMaxAgeMs = ms(process.env.ACCESS_TOKEN_TTL || "15m" as any) as unknown as number;
  const refreshMaxAgeMs = ms(process.env.REFRESH_TOKEN_TTL || "30d" as any) as unknown as number;

  const baseCookieOptions = {
    httpOnly: true,
    secure: env.cookie.secure,
    sameSite: env.cookie.sameSite as boolean | "lax" | "strict" | "none",
    domain: env.cookie.domain
  };

  // Access token cookie (short-lived)
  res.cookie("accessToken", accessToken, {
    ...baseCookieOptions,
    maxAge: accessMaxAgeMs
  });

  // Refresh token cookie (long-lived)
  res.cookie("refreshToken", refreshToken, {
    ...baseCookieOptions,
    maxAge: refreshMaxAgeMs
  });
};

export const clearAuthCookies = (res: Response) => {
  const baseCookieOptions = {
    httpOnly: true,
    secure: env.cookie.secure,
    sameSite: env.cookie.sameSite as boolean | "lax" | "strict" | "none",
    domain: env.cookie.domain
  };

  res.clearCookie("accessToken", baseCookieOptions);
  res.clearCookie("refreshToken", baseCookieOptions);
};
