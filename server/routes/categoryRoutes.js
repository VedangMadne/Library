import { Router } from "express";
import categoryControllers from "../controllers/categoryControllers.js";
import authMiddleware from "../middlewares/auth-middleware.js";
import adminMiddleware from "../middlewares/admin-middleware.js";

const categoryRouter = Router();

categoryRouter.get("/", categoryControllers.getAllCategories);
categoryRouter.post("/",authMiddleware,adminMiddleware,categoryControllers.createCategory);
categoryRouter.get("/all",authMiddleware, adminMiddleware,categoryControllers.getCategories);
categoryRouter.get("/:_id",categoryControllers.getCategory);
categoryRouter.put("/:_id",authMiddleware,adminMiddleware,categoryControllers.updateCateogry);
categoryRouter.delete("/:_id",authMiddleware,adminMiddleware,categoryControllers.deleteCategory);


export default categoryRouter;