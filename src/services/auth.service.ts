import bcrypt from "bcryptjs";
import { Farmer } from "../models/Farmer";
import { AuthSession } from "../models/AuthSession";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from "../utils/jwt";
import { ApiError } from "../utils/ApiError";
import { LoginInput, RegisterInput } from "../models/types/farmer.types";
import { AuthResult } from "../models/types/auth.types";

const SALT_ROUNDS = 10;

const computeRefreshExpiryDate = (): Date => {
  // For hackathon, I just keep it simple for now:
  const days = 30;
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
};

export class AuthService {
  static async registerFarmer(
    input: RegisterInput,
    meta: { userAgent: string | undefined; ip: string | undefined }
  ): Promise<AuthResult> {
    const {
      name,
      email,
      password,
      phone,
      preferredLanguage = "bn",
      location
    } = input;

    if (!name?.trim()) {
      throw ApiError.badRequest("Name is required", { field: "name" });
    }
    if (!email?.trim()) {
      throw ApiError.badRequest("Email is required", { field: "email" });
    }
    if (!password || password.length < 6) {
      throw ApiError.badRequest("Password must be at least 6 characters", {
        field: "password"
      });
    }

    const existing = await Farmer.findOne({ email: email.toLowerCase() }).lean();
    if (existing) {
      throw ApiError.badRequest("Email already registered", {
        field: "email"
      });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const farmer = await Farmer.create({
      name: name.trim(),
      email: email.toLowerCase(),
      passwordHash,
      phone: phone?.trim() || "",
      preferredLanguage,
      location : location || {
        division: "",
        district: "",
        upazila: "",
        village: ""
      }
    })

    // Create auth session for this device
    const session = await AuthSession.create({
      farmer: farmer._id,
      userAgent: meta.userAgent || "",
      ipAddress: meta.ip || "",
      expiresAt: computeRefreshExpiryDate(),
      isActive: true
    });

    const payload = {
      sub: farmer._id.toString(),
      sessionId: session._id.toString(),
      role: "farmer" as const
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    return {
      farmer,
      session,
      tokens: {
        accessToken,
        refreshToken
      }
    };
  }

  static async loginFarmer(
    input: LoginInput,
    meta: { userAgent: string | undefined; ip: string | undefined }
  ): Promise<AuthResult> {
    const { email, password } = input;

    if (!email?.trim() || !password) {
      throw ApiError.badRequest("Email and password are required");
    }

    const farmer = await Farmer.findOne({ email: email.toLowerCase() });
    if (!farmer) {
      throw ApiError.unauthorized("Invalid credentials");
    }

    const valid = await bcrypt.compare(password, farmer.passwordHash);
    if (!valid) {
      throw ApiError.unauthorized("Invalid credentials");
    }

    const session = await AuthSession.create({
      farmer: farmer._id,
      userAgent: meta.userAgent || "",
      ipAddress: meta.ip || "",
      expiresAt: computeRefreshExpiryDate(),
      isActive: true
    });

    const payload = {
      sub: farmer._id.toString(),
      sessionId: session._id.toString(),
      role: "farmer" as const
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    return {
      farmer,
      session,
      tokens: {
        accessToken,
        refreshToken
      }
    };
  }

  static async refreshTokens(
    refreshToken: string,
    meta?: { userAgent: string | undefined; ip: string | undefined }
  ): Promise<AuthResult> {
    if (!refreshToken) {
      throw ApiError.unauthorized("Missing refresh token");
    }

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (err: any) {
      if (err.name === "TokenExpiredError") {
        throw ApiError.unauthorized("Refresh token expired");
      }
      throw ApiError.unauthorized("Invalid refresh token");
    }

    const session = await AuthSession.findById(payload.sessionId);
    if (!session || !session.isActive) {
      throw ApiError.unauthorized("Session is no longer active");
    }

    const farmer = await Farmer.findById(payload.sub);
    if (!farmer) {
      throw ApiError.unauthorized("Farmer not found");
    }

    // For hackathon, keep same session. In production, you might rotate.
    const newPayload = {
      sub: farmer._id.toString(),
      sessionId: session._id.toString(),
      role: "farmer" as const
    };

    const accessToken = signAccessToken(newPayload);
    const newRefreshToken = signRefreshToken(newPayload);

    if(meta){
      meta.userAgent && (session.userAgent = meta.userAgent);
      meta.ip && (session.ipAddress = meta.ip);
      await session.save();
    }
    
    return {
      farmer,
      session,
      tokens: {
        accessToken,
        refreshToken: newRefreshToken
      }
    };
  }

  static async logoutCurrentSession(sessionId: string): Promise<void> {
    const session = await AuthSession.findById(sessionId);
    if (!session) return;

    session.isActive = false;
    session.revokedAt = new Date();
    await session.save();
  }

  static async logoutAllSessionsForFarmer(farmerId: string): Promise<void> {
    await AuthSession.updateMany(
      { farmer: farmerId, isActive: true },
      { isActive: false, revokedAt: new Date() }
    );
  }
}
