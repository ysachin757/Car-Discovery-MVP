import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "./appError";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      errorCode: "INVALID_PAYLOAD",
      message: "Request validation failed",
      details: err.issues
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      errorCode: err.errorCode,
      message: err.message,
      details: err.details
    });
  }

  console.error(err);
  return res.status(500).json({
    errorCode: "INTERNAL_ERROR",
    message: "Unable to process request"
  });
}
