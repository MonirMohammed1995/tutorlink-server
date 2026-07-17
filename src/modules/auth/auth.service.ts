import bcrypt from "bcrypt";
import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/ApiError";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";

import {
  RegisterUserPayload,
  LoginPayload,
} from "./auth.interface";

import { AUTH_MESSAGE } from "./auth.constant";

export const AuthService = {
  // =========================
  // Register User
  // =========================
  async registerUser(payload: RegisterUserPayload) {
    const { name, email, password } = payload;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ApiError(
        409,
        AUTH_MESSAGE.EMAIL_EXISTS
      );
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "STUDENT",
        isActive: true,
        isVerified: false,
      },
    });

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const { password: _, ...safeUser } = user;

    return {
      accessToken,
      refreshToken,
      user: safeUser,
    };
  },

  // =========================
  // Login User
  // =========================
  async loginUser(payload: LoginPayload) {
    const { email, password } = payload;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ApiError(
        404,
        AUTH_MESSAGE.USER_NOT_FOUND
      );
    }

    if (!user.isActive) {
      throw new ApiError(
        403,
        "Your account has been disabled."
      );
    }

    if (!user.password) {
      throw new ApiError(
        400,
        "Please login using Google."
      );
    }

    const isPasswordMatched =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordMatched) {
      throw new ApiError(
        401,
        AUTH_MESSAGE.INVALID_PASSWORD
      );
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const { password: _, ...safeUser } = user;

    return {
      accessToken,
      refreshToken,
      user: safeUser,
    };
  },

  // =========================
  // Refresh Access Token
  // =========================
  async refreshAccessToken(
    refreshToken: string
  ) {
    let decoded;

    try {
      decoded =
        verifyRefreshToken(refreshToken);
    } catch {
      throw new ApiError(
        401,
        AUTH_MESSAGE.INVALID_REFRESH_TOKEN
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });

    if (!user) {
      throw new ApiError(
        404,
        AUTH_MESSAGE.USER_NOT_FOUND
      );
    }

    if (!user.isActive) {
      throw new ApiError(
        403,
        "Your account has been disabled."
      );
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken,
    };
  },
  // =========================
// Logout User
// =========================
async logoutUser() {
  return null;
},
};