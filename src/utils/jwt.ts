import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

// Generate Access Token
export const generateAccessToken = (
  payload: JwtPayload
): string => {
  return jwt.sign(
    payload,
    env.JWT_ACCESS_SECRET as Secret,
    {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    } as SignOptions
  );
};

// Generate Refresh Token
export const generateRefreshToken = (
  payload: JwtPayload
): string => {
  return jwt.sign(
    payload,
    env.JWT_REFRESH_SECRET as Secret,
    {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    } as SignOptions
  );
};

// Verify Access Token
export const verifyAccessToken = (
  token: string
): JwtPayload => {
  return jwt.verify(
    token,
    env.JWT_ACCESS_SECRET as Secret
  ) as JwtPayload;
};

// Verify Refresh Token
export const verifyRefreshToken = (
  token: string
): JwtPayload => {
  return jwt.verify(
    token,
    env.JWT_REFRESH_SECRET as Secret
  ) as JwtPayload;
};