import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import cors from "cors";
import {
  almirahRouter,
  authRouter,
  bookRouter,
  categoryRouter,
  studentRouter,
  teacherRouter,
  transactionRouter,
} from "./routes/index.js";
import { errorHandlerMiddleware } from "./middlewares/index.js";
import connectCloudinary from "./config/cloudinary.js";
import { connectDB } from "./config/db.js";
import { APP_PORT } from "./config/index.js";

const app = express();
const corsConfig = {
  origin: "https://library-31.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(corsConfig));

await connectCloudinary();

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
export const ROOT_PATH = path.dirname(__filename);

app.use("/public", express.static("./public"));
app.use("/uploads", express.static("./uploads"));
app.use("/documents", express.static("./documents"));

app.use("/api/auth", authRouter);
app.use("/api/teachers", teacherRouter);
app.use("/api/students", studentRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/almirahs", almirahRouter);
app.use("/api/books", bookRouter);
app.use("/api/transactions", transactionRouter);

app.use(errorHandlerMiddleware);

await connectDB();

app.listen(APP_PORT, () => {
  console.log(`Server is running on port ${APP_PORT}`);
})
