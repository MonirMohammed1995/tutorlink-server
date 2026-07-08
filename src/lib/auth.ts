import { betterAuth } from "better-auth";
import { prisma } from "../config/prisma";

export const auth = betterAuth({
  database: prisma,

  emailAndPassword: {
    enabled: true,
  },

  secret: process.env.BETTER_AUTH_SECRET,

  baseURL: process.env.BETTER_AUTH_URL,
});