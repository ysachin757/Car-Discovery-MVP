import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { v4 as uuid } from "uuid";
import { createRoutes } from "./api/routes";
import { optionalApiKeyAuth } from "./middleware/authOptional";
import { errorHandler } from "./middleware/errorHandler";
import { simpleRateLimiter } from "./middleware/rateLimiter";

export function createApp() {
  const app = express();

  const allowedOrigins = new Set([
    process.env.CORS_ORIGIN,
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174"
  ].filter((origin): origin is string => Boolean(origin)));

  app.use(helmet());
  app.use(cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  }));
  app.use(express.json({ limit: "1mb" }));
  app.use(simpleRateLimiter);

  app.use((req, res, next) => {
    const correlationId = (req.headers["x-correlation-id"] as string) || uuid();
    res.setHeader("x-correlation-id", correlationId);
    (req as any).correlationId = correlationId;
    next();
  });

  app.use(
    morgan(":method :url :status :response-time ms :req[x-correlation-id]", {
      skip: () => process.env.NODE_ENV === "test"
    })
  );

  app.use(optionalApiKeyAuth);
  app.get("/", (_req, res) => {
    res.status(200).json({
      name: "Car Discovery Backend API",
      status: "ok",
      endpoints: {
        health: "/api/health",
        questions: "/api/questions",
        recommendations: "/api/recommendations",
        carById: "/api/cars/:carId"
      }
    });
  });
  app.use("/api", createRoutes());
  app.use(errorHandler);

  return app;
}
