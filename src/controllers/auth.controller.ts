import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { sendSuccess } from "../utils/sendResponse";
import { AuthService } from "../services/auth.service";
import { ApiError } from "../utils/ApiError";
import { clearAuthCookies, setAuthCookies } from "../utils/authCookies";

const getMetaFromRequest = (req: Request) => ({
  userAgent: req.headers["user-agent"],
  ip: (req.headers["x-forwarded-for"] as string) || req.ip
});

export const registerFarmerController = catchAsync(
  async (req: Request, res: Response) => {
    const meta = getMetaFromRequest(req);

    const { farmer, tokens } = await AuthService.registerFarmer(req.body, meta);

    // Set cookies + still return tokens in body
    setAuthCookies(res, {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    });

    return sendSuccess(res, 201, {
      success: true,
      message: "Farmer registered successfully",
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        farmer: {
          id: farmer._id,
          name: farmer.name,
          email: farmer.email,
          phone: farmer.phone,
          preferredLanguage: farmer.preferredLanguage
        }
      }
    });
  }
);

export const loginFarmerController = catchAsync(
  async (req: Request, res: Response) => {
    const meta = getMetaFromRequest(req);

    const { farmer, tokens } = await AuthService.loginFarmer(req.body, meta);
    
    // Set cookies + still return tokens in body
    setAuthCookies(res, {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    });

    return sendSuccess(res, 200, {
      success: true,
      message: "Login successful",
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        farmer: {
          id: farmer._id,
          name: farmer.name,
          email: farmer.email,
          phone: farmer.phone,
          preferredLanguage: farmer.preferredLanguage
        }
      }
    });
  }
);

export const refreshTokenController = catchAsync(
  async (req: Request, res: Response) => {
    const meta = getMetaFromRequest(req);

    // read refreshToken either from body or cookie
    const fromBody = (req.body && req.body.refreshToken) || undefined;
    const fromCookie = req.cookies?.refreshToken as string | undefined;
    const refreshToken = fromBody || fromCookie;

    if (!refreshToken) {
      throw ApiError.badRequest("refreshToken is required", {
        field: "refreshToken"
      });
    }

    const { farmer, tokens } = await AuthService.refreshTokens(
      refreshToken,
      meta
    );

     setAuthCookies(res, {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    });

    return sendSuccess(res, 200, {
      success: true,
      message: "Tokens refreshed",
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        farmer: {
          id: farmer._id,
          name: farmer.name,
          email: farmer.email,
          phone: farmer.phone,
          preferredLanguage: farmer.preferredLanguage
        }
      }
    });
  }
);

export const logoutCurrentSessionController = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.authUser) {
      throw ApiError.unauthorized("Not authenticated");
    }

    await AuthService.logoutCurrentSession(req.authUser.sessionId);

    clearAuthCookies(res);

    return sendSuccess(res, 200, {
      success: true,
      message: "Logged out from current device",
      data: null
    });
  }
);

export const logoutAllSessionsController = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.authUser) {
      throw ApiError.unauthorized("Not authenticated");
    }

    await AuthService.logoutAllSessionsForFarmer(req.authUser.id);

    clearAuthCookies(res);

    return sendSuccess(res, 200, {
      success: true,
      message: "Logged out from all devices",
      data: null
    });
  }
);
