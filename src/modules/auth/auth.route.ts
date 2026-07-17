import { Router } from "express";

import { AuthController } from "./auth.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validateRequest";

import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from "./auth.validation";

const router = Router();

/**
 * =========================
 * Public Routes
 * =========================
 */

// Register
router.post(
  "/register",
  validateRequest(registerSchema),
  AuthController.register
);

// Login
router.post(
  "/login",
  validateRequest(loginSchema),
  AuthController.login
);

// Refresh Access Token
router.post(
  "/refresh-token",
  validateRequest(refreshTokenSchema),
  AuthController.refreshToken
);

/**
 * =========================
 * Protected Routes
 * =========================
 */

// Current Logged In User
router.get(
  "/me",
  authMiddleware,
  AuthController.currentUser
);
router.post(
   "/logout",
   AuthController.logout
);

export default router;