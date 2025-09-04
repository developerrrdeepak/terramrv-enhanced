import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Upload } from "lucide-react";

import Header from "@/components/farmer-dashboard/Header";
import BottomNav from "@/components/farmer-dashboard/BottomNav";
import MapCard from "@/components/farmer-dashboard/MapCard";
import CarbonWalletCard from "@/components/farmer-dashboard/CarbonWalletCard";
import WeatherCard from "@/components/farmer-dashboard/WeatherCard";
import TasksCard from "@/components/farmer-dashboard/TasksCard";
import PaymentsCard from "@/components/farmer-dashboard/PaymentsCard";
import NotificationsPanel from "@/components/farmer-dashboard/NotificationsPanel";

export default function FarmerDashboard() {
  const { user, isAuthenticated, updateProfile } = useAuth();
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    aadhaarId: "",
    farmerId: "",
    address: "",
    pincode: "",
    landSize: "",
  });
  const [farmData, setFarmData] = useState({
    soilPh: "",
    soilMoisture: "",
    cropType: "",
    irrigationType: "",
    waterUsage: "",
    areaPlanted: "",
  });
  const [loading, setLoading] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);

  const earningsData = useMemo(() => {
    const landSize = parseFloat((user?.farmer?.landSize as any) || profile.landSize || "0") || 0;
    const creditsPerHectare = 2.5;
    const pricePerCredit = 500;
    const monthly = Array.from({ length: 6 }).map((_, i) => {
      const base = landSize * creditsPerHectare * pricePerCredit;
      const seasonal = Math.sin((i / 6) * Math.PI) * 0.15;
      const income = Math.max(0, Math.round(base * (1 + seasonal)));
      return {
        month: new Date(new Date().setMonth(new Date().getMonth() - (5 - i))).toLocaleString("en-US", { month: "short" }),
        income,
      };
    });
    return monthly;
  }, [user, profile.landSize]);

  useEffect(() => {
    if (user?.farmer) {
      setProfile({
        name: user.farmer.name || "",
        phone: user.farmer.phone || "",
        aadhaarId: user.farmer.aadhaarId || "",
        farmerId: user.farmer.farmerId || "",
        address: user.farmer.location?.address || "",
        pincode: user.farmer.location?.pincode || "",
        landSize: user.farmer.landSize?.toString() || "",
      });

      const isComplete = user.farmer.name && user.farmer.phone && user.farmer.aadhaarId && user.farmer.location?.address;
      setProfileComplete(!!isComplete);
    }
  }, [user]);

  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (user?.type !== "farmer") {
    const fallback = user?.type === "admin" ? "/admin-dashboard" : "/";
    return <Navigate to={fallback} replace />;
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile({
        name: profile.name,
        phone: profile.phone,
        aadhaarId: profile.aadhaarId,
        farmerId: profile.farmerId,
        location: {
          address: profile.address,
          pincode: profile.pincode,
        },
        landSize: parseFloat(profile.landSize) || 0,
      });

      toast.success("Profile updated successfully!");
      setProfileComplete(true);
    } catch (error) {
      toast.error("Failed to update profile");
    }

    setLoading(false);
  };

  const handleFarmDataSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      toast.success("Farm data submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit farm data");
    }

    setLoading(false);
  };

  const calculateCarbonCredits = () => {
    const landSize = parseFloat(profile.landSize) || 0;
    const creditsPerHectare = 2.5;
    const pricePerCredit = 500;

    const totalCredits = landSize * creditsPerHectare;
    const estimatedIncome = totalCredits * pricePerCredit;

    return { totalCredits, estimatedIncome };
  };

  const { totalCredits, estimatedIncome } = calculateCarbonCredits();

  return (
    <div className="min-h-screen bg-[#F9F9F9] p-4">
      <div className="max-w-7xl mx-auto">
        <Header />

        <main className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MapCard />
              <CarbonWalletCard credits={Math.round(totalCredits)} co2={Math.round(totalCredits * 0.5)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <WeatherCard />
              <TasksCard />
              <PaymentsCard />
            </div>

            <Card className="rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle>Profile & Farm Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <form onSubmit={handleProfileUpdate} className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input id="name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} required />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone *</Label>
                        <Input id="phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} required />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button type="submit" className="bg-[#4CAF50]">{loading ? 'Updating...' : 'Update'}</Button>
                      <Button variant="outline">Export Data</Button>
                    </div>
                  </form>

                  <form onSubmit={handleFarmDataSubmit} className="space-y-3">
                    <div>
                      <Label>Soil pH</Label>
                      <Input value={farmData.soilPh} onChange={(e) => setFarmData({ ...farmData, soilPh: e.target.value })} />
                    </div>
                    <div>
                      <Label>Area Planted (ha)</Label>
                      <Input value={farmData.areaPlanted} onChange={(e) => setFarmData({ ...farmData, areaPlanted: e.target.value })} />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button type="submit" className="bg-[#4CAF50]">{loading ? 'Saving...' : 'Save Farm Data'}</Button>
                    </div>
                  </form>
                </div>
              </CardContent>
            </Card>

          </section>

          <aside className="space-y-4">
            <NotificationsPanel />

            <Card className="rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle>Quick Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-gray-700">Land Size</div>
                  <div className="text-xl font-bold">{profile.landSize || '—'} ha</div>

                  <div className="text-sm text-gray-700">Estimated Credits</div>
                  <div className="text-xl font-bold text-[#4CAF50]">{Math.round(totalCredits)} cr</div>

                  <div className="text-sm text-gray-700">Estimated Income</div>
                  <div className="text-xl font-bold text-[#795548]">₹{Math.round(estimatedIncome)}</div>
                </div>
              </CardContent>
            </Card>

          </aside>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
