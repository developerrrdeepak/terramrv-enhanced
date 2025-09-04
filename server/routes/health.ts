import { RequestHandler } from "express";
import Database from "../lib/database";
import EmailService from "../lib/emailService";

interface HealthResponse {
  status: "healthy" | "unhealthy";
  timestamp: string;
  services: {
    database: "connected" | "disconnected";
    email: "configured" | "not_configured";
    server: "running";
  };
  email_provider: string;
  message: string;
}

export const healthCheck: RequestHandler = async (req, res) => {
  try {
    const db = Database.getInstance();
    const emailService = EmailService.getInstance();

    const isDatabaseHealthy = await db.healthCheck();
    const emailStatus = emailService.getStatus();

    const response: HealthResponse = {
      status: isDatabaseHealthy ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      services: {
        database: isDatabaseHealthy ? "connected" : "disconnected",
        email: emailStatus.configured ? "configured" : "not_configured",
        server: "running",
      },
      email_provider: emailStatus.provider,
      message: isDatabaseHealthy
        ? "All services are operational"
        : "Database connection issues detected",
    };

    const statusCode = isDatabaseHealthy ? 200 : 503;
    res.status(statusCode).json(response);
  } catch (error) {
    console.error("Health check error:", error);

    const emailService = EmailService.getInstance();
    const emailStatus = emailService.getStatus();

    const response: HealthResponse = {
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      services: {
        database: "disconnected",
        email: emailStatus.configured ? "configured" : "not_configured",
        server: "running",
      },
      email_provider: emailStatus.provider,
      message: "System health check failed",
    };

    res.status(503).json(response);
  }
};
