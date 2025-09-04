import { RequestHandler } from "express";

// Simple endpoints to validate GEE service account JSON accessibility and queue NDVI jobs
export const validateGEEKey: RequestHandler = async (req, res) => {
  try {
    const url = process.env.GEE_SERVICE_ACCOUNT_URL;
    if (!url)
      return res
        .status(400)
        .json({
          success: false,
          message: "GEE service account URL not configured",
        });

    const r = await fetch(url);
    if (!r.ok)
      return res
        .status(502)
        .json({ success: false, message: "Failed to fetch GEE JSON" });

    const json = await r.json();
    // Basic validation: check for client_email and private_key
    if (!json.client_email || !json.private_key) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid GEE service account JSON" });
    }

    res.json({
      success: true,
      message: "GEE service account JSON accessible",
      client_email: json.client_email,
    });
  } catch (error) {
    console.error("❌ [GEE VALIDATE] Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Queue NDVI job (stores job in MongoDB credits collection for demo)
export const queueNdviJob: RequestHandler = async (req, res) => {
  try {
    const db = (await import("../lib/database")).default.getInstance();
    const jobsCol = db.getDb().collection("mrv_jobs");
    const { area, description } = req.body as {
      area?: any;
      description?: string;
    };
    if (!area)
      return res.status(400).json({ success: false, message: "area required" });

    const job = {
      area,
      description: description || null,
      status: "queued",
      createdAt: new Date(),
    };

    const result = await jobsCol.insertOne(job as any);

    res.json({ success: true, jobId: result.insertedId.toString() });
  } catch (error) {
    console.error("❌ [QUEUE NDVI] Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
