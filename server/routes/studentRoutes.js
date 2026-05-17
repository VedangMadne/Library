import {Router} from "express";
import authMiddleware from "../middlewares/auth-middleware.js";
import adminMiddleware from "../middlewares/admin-middleware.js";
import studentControllers from "../controllers/studentControllers.js";

const studentRouter = Router();

studentRouter.post("/",authMiddleware,adminMiddleware,studentControllers.createStudent);
studentRouter.get("/",authMiddleware,adminMiddleware,studentControllers.getStudents);
studentRouter.put("/:_id",authMiddleware,adminMiddleware,studentControllers.updateStudent);
studentRouter.delete("/:_id",authMiddleware,adminMiddleware,studentControllers.deleteStudent);
studentRouter.get("/:_id",authMiddleware,studentControllers.getStudent);
export default studentRouter;