import { RequestHandler } from "express";
import fs from "fs/promises";
import path from "path";
import AuthService from "../lib/services";

const authService = new AuthService();

async function ensureUploadsDir() {
  const dir = path.join(process.cwd(), "public", "uploads");
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (e) {
    // ignore
  }
  return dir;
}

// Expects JSON { filename, data } where data is base64 data URL or base64 string
export const uploadProfilePhoto: RequestHandler = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ success: false, message: "No token provided" });

    const user = await authService.getUserByToken(token);
    if (!user) return res.status(401).json({ success: false, message: "Invalid token" });

    const { filename, data } = req.body as { filename?: string; data?: string };
    if (!data) return res.status(400).json({ success: false, message: "No data provided" });

    const dir = await ensureUploadsDir();
    const safeName = (filename || `${user.type}_photo_${Date.now()}`).replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = path.join(dir, safeName);

    // Handle data URL
    const base64 = data.includes(",") ? data.split(",")[1] : data;
    const buffer = Buffer.from(base64, "base64");
    await fs.writeFile(filePath, buffer);

    const urlPath = `/uploads/${safeName}`;

    // Update user profile (farmer or admin)
    if (user.type === "farmer") {
      await authService.updateFarmer(user.farmer!.id, { photoUrl: urlPath });
    } else if (user.type === "admin") {
      await authService.updateAdmin(user.admin!.id, { photoUrl: urlPath });
    }

    res.json({ success: true, url: urlPath });
  } catch (error) {
    console.error("❌ [UPLOAD PHOTO] Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Upload KYC documents - accepts array of { filename, data, type }
export const uploadKyc: RequestHandler = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ success: false, message: "No token provided" });

    const user = await authService.getUserByToken(token);
    if (!user) return res.status(401).json({ success: false, message: "Invalid token" });

    const docs = req.body?.docs as Array<{ filename?: string; data?: string; type?: string }>;
    if (!Array.isArray(docs) || docs.length === 0) return res.status(400).json({ success: false, message: "No documents provided" });

    const dir = await ensureUploadsDir();
    const saved: any[] = [];

    for (const doc of docs) {
      const safeName = (doc.filename || `doc_${Date.now()}`).replace(/[^a-zA-Z0-9._-]/g, "_");
      const filePath = path.join(dir, safeName);
      const base64 = (doc.data || "").includes(",") ? (doc.data || "").split(",")[1] : doc.data;
      const buffer = Buffer.from(base64 || "", "base64");
      await fs.writeFile(filePath, buffer);
      const urlPath = `/uploads/${safeName}`;
      saved.push({ type: doc.type || "unknown", url: urlPath });
    }

    // Store KYC references on user record
    if (user.type === "farmer") {
      await authService.updateFarmer(user.farmer!.id, { kyc: saved });
    } else if (user.type === "admin") {
      await authService.updateAdmin(user.admin!.id, { kyc: saved });
    }

    res.json({ success: true, docs: saved });
  } catch (error) {
    console.error("❌ [UPLOAD KYC] Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
