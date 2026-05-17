import { Router } from "express";
import authMiddleware from "../middlewares/auth-middleware.js";
import adminMiddleware from "../middlewares/admin-middleware.js";
import transactionControllers from "../controllers/transactionControllers.js";


const transactionRouter = Router();

transactionRouter.get("/admin-dashboard-stats",authMiddleware,adminMiddleware,transactionControllers.adminDashboardStats
);
transactionRouter.post("/issue-book",authMiddleware,adminMiddleware,transactionControllers.issuedBook);
transactionRouter.get("/user-info",authMiddleware,adminMiddleware,transactionControllers.userInfo);
transactionRouter.get("/book-info",authMiddleware,adminMiddleware,transactionControllers.bookInfo);
transactionRouter.post("/return-book",authMiddleware,adminMiddleware,transactionControllers.returnBook);
transactionRouter.post("/pay-fine",authMiddleware,adminMiddleware,transactionControllers.payFine);
transactionRouter.get("/issued-books",authMiddleware,adminMiddleware,transactionControllers.getIssuedBooks);
transactionRouter.get("/returned-books",authMiddleware,adminMiddleware,transactionControllers.getReturnedBooks);
transactionRouter.get("/files/export",authMiddleware,adminMiddleware,transactionControllers.exportIssuedBooks);
transactionRouter.get("/files/backup",authMiddleware,adminMiddleware,transactionControllers.backupAllData);


export default transactionRouter;