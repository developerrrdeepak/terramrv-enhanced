import { RequestHandler } from "express";
import { ObjectId } from "mongodb";
import Database from "../lib/database";
import AuthService from "../lib/services";

const authService = new AuthService();
const db = Database.getInstance();

async function adminGuard(req: any, res: any) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    res.status(401).json({ success: false, message: "No token provided" });
    return null;
  }
  return await authService.getUserByToken(token);
}

export const getCredits: RequestHandler = async (req, res) => {
  try {
    const user = await adminGuard(req, res);
    if (!user || user.type !== "admin") return;

    const creditsCollection = db.getCreditsCollection();
    const credits = await creditsCollection
      .find({})
      .sort({ requestedAt: -1 })
      .toArray();

    res.json({ success: true, credits });
  } catch (error) {
    console.error("❌ [GET CREDITS] Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const approveCredit: RequestHandler = async (req, res) => {
  try {
    const user = await adminGuard(req, res);
    if (!user || user.type !== "admin") return;

    const { creditId, approve } = req.body as {
      creditId?: string;
      approve?: boolean;
    };
    if (!creditId)
      return res
        .status(400)
        .json({ success: false, message: "creditId required" });

    const creditsCollection = db.getCreditsCollection();

    const objectId = new ObjectId(creditId);
    const update = {
      $set: {
        status: approve ? "approved" : "rejected",
        approvedBy: user.admin?.email || "system",
        approvedAt: new Date(),
      },
    } as any;

    const result = await creditsCollection.findOneAndUpdate(
      { _id: objectId },
      update,
      { returnDocument: "after" },
    );

    if (!result.value)
      return res
        .status(404)
        .json({ success: false, message: "Credit not found" });

    const c = result.value as any;

    // If approved, update farmer record (increase carbonCredits) if farmer exists
    if (approve && c.farmerId) {
      try {
        const farmer = await authService.findFarmerById(c.farmerId);
        const currentCredits = (farmer && (farmer as any).carbonCredits) || 0;
        await authService.updateFarmer(c.farmerId, {
          carbonCredits: currentCredits + (c.amount || 0),
        } as any);
      } catch (e) {
        console.warn("⚠️ [APPROVE CREDIT] Failed to update farmer credits:", e);
      }
    }

    res.json({ success: true, credit: c });
  } catch (error) {
    console.error("❌ [APPROVE CREDIT] Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getPayouts: RequestHandler = async (req, res) => {
  try {
    const user = await adminGuard(req, res);
    if (!user || user.type !== "admin") return;

    const payoutsCollection = db.getPayoutsCollection();
    const payouts = await payoutsCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.json({ success: true, payouts });
  } catch (error) {
    console.error("❌ [GET PAYOUTS] Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const markPayoutPaid: RequestHandler = async (req, res) => {
  try {
    const user = await adminGuard(req, res);
    if (!user || user.type !== "admin") return;

    const { payoutId } = req.body as { payoutId?: string };
    if (!payoutId)
      return res
        .status(400)
        .json({ success: false, message: "payoutId required" });

    const payoutsCollection = db.getPayoutsCollection();
    const objectId = new ObjectId(payoutId);

    const update = {
      $set: {
        status: "paid",
        paidBy: user.admin?.email || "system",
        paidAt: new Date(),
      },
    } as any;

    const result = await payoutsCollection.findOneAndUpdate(
      { _id: objectId },
      update,
      { returnDocument: "after" },
    );

    if (!result.value)
      return res
        .status(404)
        .json({ success: false, message: "Payout not found" });

    res.json({ success: true, payout: result.value });
  } catch (error) {
    console.error("❌ [MARK PAYOUT] Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
