import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ApiResponse } from "../../utils/ApiResponse";
import { AuthService } from "./auth.service";
import { AUTH_MESSAGE } from "./auth.constant";
import { AuthRequest } from "../../middlewares/auth.middleware";

export const AuthController = {
  // =========================
  // Register
  // =========================
  register: catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.registerUser(req.body);

    res.status(201).json(
      new ApiResponse(
        true,
        AUTH_MESSAGE.REGISTER_SUCCESS,
        result
      )
    );
  }),

  // =========================
  // Login
  // =========================
  login: catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.loginUser(req.body);

    res.status(200).json(
      new ApiResponse(
        true,
        AUTH_MESSAGE.LOGIN_SUCCESS,
        result
      )
    );
  }),

  // =========================
  // Refresh Token
  // =========================
  refreshToken: catchAsync(
    async (req: Request, res: Response) => {
      const { refreshToken } = req.body;

      const result =
        await AuthService.refreshAccessToken(
          refreshToken
        );

      res.status(200).json(
        new ApiResponse(
          true,
          AUTH_MESSAGE.REFRESH_TOKEN_SUCCESS,
          result
        )
      );
    }
  ),

  // =========================
  // Current User
  // =========================
  currentUser: catchAsync(
    async (req: AuthRequest, res: Response) => {
      res.status(200).json(
        new ApiResponse(
          true,
          "Current user fetched successfully",
          req.user
        )
      );
    }
  ),
  // Logout
logout: catchAsync(async (req: Request, res: Response) => {

   await AuthService.logoutUser();

   res.status(200).json(
      new ApiResponse(
         true,
         AUTH_MESSAGE.LOGOUT_SUCCESS,
         null
      )
   );

}),
};