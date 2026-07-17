import { Router } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../lib/auth";

const router = Router();

// Better Auth handles ALL auth endpoints
router.all("/*splat", toNodeHandler(auth));

export default router;