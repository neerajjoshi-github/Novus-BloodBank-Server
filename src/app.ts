import express, { Request, Response, NextFunction } from "express";
import userRoutes from "../routes/userRoutes";
import inventoryRoutes from "../routes/inventoryRoutes";
import dashboardRoutes from "../routes/dashboardRoutes";
import createHttpError, { isHttpError } from "http-errors";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use("/api/user", userRoutes);

app.use("/api/inventory", inventoryRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use((req, res, next) => {
  next(createHttpError(404, "Page not found!!!"));
});

// Error Handler
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  let errorMessage = "An unknown error occured!!";
  let statusCode = 500;
  if (isHttpError(error)) {
    errorMessage = error.message;
    statusCode = error.status;
  } else if (error instanceof mongoose.Error.ValidationError) {
    errorMessage = "Missing arguments!!";
    statusCode = 400;
  }

  res
    .status(statusCode)
    .json({ status: "not ok", message: errorMessage, data: {} });
});
export default app;
