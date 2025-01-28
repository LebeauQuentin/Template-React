import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { controllerWrapper as cw } from "../middlewares/index.middleware.js";


export const router = Router();

router.post("/auth/register", cw(authController.registerUser));
router.post("/auth/login", cw(authController.loginUser));
router.delete("/auth/logout", cw(authController.logout));
router.post("/auth/refresh", cw(authController.refreshAccessToken));
router.get("/auth/me", cw(authController.getCurrentUser));
