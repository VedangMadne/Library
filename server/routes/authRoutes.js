import { Router } from "express";
import authMiddleware from "../middlewares/auth-middleware.js";
import authControllers from "../controllers/authControllers.js";
import adminMiddleware from "../middlewares/admin-middleware.js";

const authRouter = Router();

authRouter.post("/login",authControllers.login);
authRouter.get("/refresh-tokens",authControllers.refreshTokens);
authRouter.get("/user-details",authMiddleware,adminMiddleware,authControllers.getUserDetails);
authRouter.post("/change-password",authMiddleware,authControllers.changePassword);
authRouter.get("/logout",authMiddleware,adminMiddleware,authControllers.logout);

authRouter.get("/home-data", authControllers.getHomeData);

export default authRouter;
