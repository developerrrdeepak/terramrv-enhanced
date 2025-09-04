import { RequestHandler } from "express";
import EmailService from "../lib/emailService";
import Database from "../lib/database";

export const debugStatus: RequestHandler = async (req, res) => {
  try {
    // Protect endpoint in production with a token
    const token = req.query.token as string | undefined;

    if (process.env.NODE_ENV === "production") {
      if (!process.env.DEBUG_TOKEN) {
        return res.status(403).json({
          success: false,
          message:
            "Debug endpoint disabled in production. Set DEBUG_TOKEN to enable.",
        });
      }

      if (!token || token !== process.env.DEBUG_TOKEN) {
        return res.status(401).json({ success: false, message: "Invalid debug token" });
      }
    }

    const emailService = EmailService.getInstance();
    const emailStatus = emailService.getStatus();

    const env = {
      ADMIN_EMAIL: !!process.env.ADMIN_EMAIL,
      ADMIN_PASSWORD: !!process.env.ADMIN_PASSWORD,
      JWT_SECRET: !!process.env.JWT_SECRET,
      SENDGRID_API_KEY: !!process.env.SENDGRID_API_KEY,
      SENDGRID_FROM_EMAIL: !!process.env.SENDGRID_FROM_EMAIL,
      MONGODB_URI: !!process.env.MONGODB_URI,
      NODE_ENV: process.env.NODE_ENV || "development",
    };

    // Optional DB connectivity check (only when explicitly requested and MONGODB_URI is set)
    const checkDb = (req.query.db as string | undefined) === "true";
    let dbConnected: boolean | null = null;
    let dbError: string | null = null;

    if (checkDb && env.MONGODB_URI) {
      try {
        const db = Database.getInstance();
        await db.connect();
        dbConnected = true;
        // don't disconnect to avoid interrupting running server
      } catch (error: any) {
        dbConnected = false;
        dbError = error?.message || String(error);
      }
    }

    res.json({
      success: true,
      env,
      email_service: emailStatus,
      db_check: checkDb ? { connected: dbConnected, error: dbError } : undefined,
      timestamp: new Date().toISOString(),
      note:
        "This endpoint reports presence of environment variables and email service status. It does NOT return secret values.",
    });
  } catch (error: any) {
    console.error("❌ [DEBUG STATUS] Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
