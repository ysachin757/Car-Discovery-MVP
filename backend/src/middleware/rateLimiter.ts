import { NextFunction, Request, Response } from "express";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 120;

const hits = new Map<string, { count: number; start: number }>();

export function simpleRateLimiter(req: Request, res: Response, next: NextFunction) {
  const now = Date.now();
  const key = req.ip || "unknown";
  const entry = hits.get(key);

  if (!entry || now - entry.start >= WINDOW_MS) {
    hits.set(key, { count: 1, start: now });
    next();
    return;
  }

  entry.count += 1;
  if (entry.count > MAX_REQUESTS) {
    res.status(429).json({
      errorCode: "RATE_LIMITED",
      message: "Too many requests. Please try again shortly."
    });
    return;
  }

  next();
}
