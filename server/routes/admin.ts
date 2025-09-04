import { RequestHandler } from "express";
import AuthService from "../lib/services";

const authService = new AuthService();

// In-memory store for credits and payouts (for demo purposes)
const creditsStore: Array<any> = [
  {
    id: "c1",
    farmerId: "1",
    farmerName: "Rajesh Kumar",
    project: "Agroforestry Initiative",
    amount: 25.5,
    status: "pending",
    requestedAt: new Date().toISOString(),
  },
  {
    id: "c2",
    farmerId: "3",
    farmerName: "Amit Singh",
    project: "Rice Carbon Project",
    amount: 18.7,
    status: "pending",
    requestedAt: new Date().toISOString(),
  },
];

const payoutsStore: Array<any> = [
  {
    id: "p1",
    farmerId: "1",
    farmerName: "Rajesh Kumar",
    amount: 5000,
    status: "pending",
    createdAt: new Date().toISOString(),
  },
];

function adminGuard(req: any, res: any) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    res.status(401).json({ success: false, message: "No token provided" });
    return null;
  }
  return authService.getUserByToken(token);
}

export const getCredits: RequestHandler = async (req, res) => {
  try {
    const user = await adminGuard(req, res);
    if (!user || user.type !== "admin") return;

    res.json({ success: true, credits: creditsStore });
  } catch (error) {
    console.error("❌ [GET CREDITS] Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const approveCredit: RequestHandler = async (req, res) => {
  try {
    const user = await adminGuard(req, res);
    if (!user || user.type !== "admin") return;

    const { creditId, approve } = req.body as { creditId?: string; approve?: boolean };
    if (!creditId) return res.status(400).json({ success: false, message: "creditId required" });

    const c = creditsStore.find((x) => x.id === creditId);
    if (!c) return res.status(404).json({ success: false, message: "Credit not found" });

    c.status = approve ? "approved" : "rejected";
    c.approvedBy = user.admin?.email || "system";
    c.approvedAt = new Date().toISOString();

    // If approved, update farmer record (increase carbonCredits) if farmer exists
    if (approve && c.farmerId) {
      try {
        await authService.updateFarmer(c.farmerId, {
          carbonCredits: (c.amount || 0) + (c.carbonCredits || 0),
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

    res.json({ success: true, payouts: payoutsStore });
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
    if (!payoutId) return res.status(400).json({ success: false, message: "payoutId required" });

    const p = payoutsStore.find((x) => x.id === payoutId);
    if (!p) return res.status(404).json({ success: false, message: "Payout not found" });

    p.status = "paid";
    p.paidBy = user.admin?.email || "system";
    p.paidAt = new Date().toISOString();

    res.json({ success: true, payout: p });
  } catch (error) {
    console.error("❌ [MARK PAYOUT] Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
