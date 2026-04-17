import { NextFunction, Request, Response } from "express";

// Optional API-key based guard for future private endpoints.
export function optionalApiKeyAuth(req: Request, res: Response, next: NextFunction) {
  const enabled = process.env.ENABLE_API_KEY_AUTH === "true";
  if (!enabled) {
    next();
    return;
  }

  const expected = process.env.INTERNAL_API_KEY;
  const provided = req.headers["x-api-key"] as string | undefined;

  if (!expected || !provided || provided !== expected) {
    res.status(401).json({
      errorCode: "UNAUTHORIZED",
      message: "Invalid or missing API key"
    });
    return;
  }

  next();
}
