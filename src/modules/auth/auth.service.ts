import bcrypt from "bcrypt";

import { prisma } from "../../config/prisma";

import { ApiError } from "../../utils/ApiError";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/jwt";

import {
  LoginPayload,
  RegisterUserPayload,
} from "./auth.interface";

import { AUTH_MESSAGE } from "./auth.constant";
export const registerUser = async (
  payload: RegisterUserPayload
) => {
  const { name, email, password } = payload;

  // Check Existing User

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new ApiError(
      409,
      AUTH_MESSAGE.EMAIL_EXISTS
    );
  }

  // Hash Password

  const hashedPassword = await bcrypt.hash(
    password,
    10
  );

  // Create User

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

  // Generate Tokens

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

  return {
    accessToken,
    refreshToken,
    user,
  };
};