import React, { Suspense, lazy, useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Upload } from "lucide-react";

import Header from "@/components/farmer-dashboard/Header";
import Sidebar from "@/components/farmer-dashboard/Sidebar";
import BottomNav from "@/components/farmer-dashboard/BottomNav";
import NotificationsPanel from "@/components/farmer-dashboard/NotificationsPanel";

const MapCard = lazy(() => import("@/components/farmer-dashboard/MapCard"));
const ProfileEditor = lazy(() => import("@/components/farmer-dashboard/ProfileEditor"));
const CarbonWalletCard = lazy(
  () => import("@/components/farmer-dashboard/CarbonWalletCard"),
);
const WeatherCard = lazy(
  () => import("@/components/farmer-dashboard/WeatherCard"),
);
const TasksCard = lazy(() => import("@/components/farmer-dashboard/TasksCard"));
const PaymentsCard = lazy(
  () => import("@/components/farmer-dashboard/PaymentsCard"),
);

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
  const [activeTab, setActiveTab] = useState<string>("overview");

  // map tab value to sidebar friendly key
  const tabToKey: Record<string, string> = {
    overview: "Overview",
    map: "Farm Map",
    carbon: "Carbon Wallet",
    profile: "Profile",
  };
  const keyToTab: Record<string, string> = {
    Overview: "overview",
    "Farm Map": "map",
    "Carbon Wallet": "carbon",
    Profile: "profile",
    Weather: "overview",
    Payments: "overview",
    Help: "overview",
  };

  const handleSidebarSelect = (key: string) => {
    const tab = keyToTab[key] || "overview";
    setActiveTab(tab);
    // focus main content for accessibility
    const main = document.querySelector('main');
    if (main) (main as HTMLElement).focus();
  };

  const earningsData = useMemo(() => {
    const landSize =
      parseFloat((user?.farmer?.landSize as any) || profile.landSize || "0") ||
      0;
    const creditsPerHectare = 2.5;
    const pricePerCredit = 500;
    const monthly = Array.from({ length: 6 }).map((_, i) => {
      const base = landSize * creditsPerHectare * pricePerCredit;
      const seasonal = Math.sin((i / 6) * Math.PI) * 0.15;
      const income = Math.max(0, Math.round(base * (1 + seasonal)));
      return {
        month: new Date(
          new Date().setMonth(new Date().getMonth() - (5 - i)),
        ).toLocaleString("en-US", { month: "short" }),
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

      const isComplete =
        user.farmer.name &&
        user.farmer.phone &&
        user.farmer.aadhaarId &&
        user.farmer.location?.address;
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
    <div className="min-h-screen bg-[#F9F9F9] p-6">
      <div className="max-w-8xl mx-auto">
        <Header />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Sidebar />

          <div className="lg:col-span-3">
            <Tabs defaultValue="overview" className="">
              <TabsList className="grid grid-cols-4 gap-2 mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="map">Map</TabsTrigger>
                <TabsTrigger value="carbon">Carbon</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <section className="lg:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Suspense
                        fallback={
                          <div className="p-6 bg-white rounded-lg shadow-sm">
                            Loading map...
                          </div>
                        }
                      >
                        <MapCard />
                        <CarbonWalletCard
                          credits={Math.round(totalCredits)}
                          co2={Math.round(totalCredits * 0.5)}
                        />
                      </Suspense>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Suspense
                        fallback={
                          <div className="p-6 bg-white rounded-lg shadow-sm">
                            Loading...
                          </div>
                        }
                      >
                        <WeatherCard />
                        <TasksCard />
                        <PaymentsCard />
                      </Suspense>
                    </div>

                    <Card className="rounded-2xl shadow-sm">
                      <CardHeader>
                        <CardTitle>Profile & Farm Data</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <form
                            onSubmit={handleProfileUpdate}
                            className="space-y-3"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <Label htmlFor="name">Full Name *</Label>
                                <Input
                                  id="name"
                                  value={profile.name}
                                  onChange={(e) =>
                                    setProfile({
                                      ...profile,
                                      name: e.target.value,
                                    })
                                  }
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="phone">Phone *</Label>
                                <Input
                                  id="phone"
                                  value={profile.phone}
                                  onChange={(e) =>
                                    setProfile({
                                      ...profile,
                                      phone: e.target.value,
                                    })
                                  }
                                  required
                                />
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button type="submit" className="bg-[#4CAF50]">
                                {loading ? "Updating..." : "Update"}
                              </Button>
                              <Button variant="outline">Export Data</Button>
                            </div>
                          </form>

                          <form
                            onSubmit={handleFarmDataSubmit}
                            className="space-y-3"
                          >
                            <div>
                              <Label>Soil pH</Label>
                              <Input
                                value={farmData.soilPh}
                                onChange={(e) =>
                                  setFarmData({
                                    ...farmData,
                                    soilPh: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <Label>Area Planted (ha)</Label>
                              <Input
                                value={farmData.areaPlanted}
                                onChange={(e) =>
                                  setFarmData({
                                    ...farmData,
                                    areaPlanted: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Button type="submit" className="bg-[#4CAF50]">
                                {loading ? "Saving..." : "Save Farm Data"}
                              </Button>
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
                          <div className="text-xl font-bold">
                            {profile.landSize || "—"} ha
                          </div>

                          <div className="text-sm text-gray-700">
                            Estimated Credits
                          </div>
                          <div className="text-xl font-bold text-[#4CAF50]">
                            {Math.round(totalCredits)} cr
                          </div>

                          <div className="text-sm text-gray-700">
                            Estimated Income
                          </div>
                          <div className="text-xl font-bold text-[#795548]">
                            ₹{Math.round(estimatedIncome)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </aside>
                </main>
              </TabsContent>

              <TabsContent value="map">
                <div className="mt-4">
                  <Suspense
                    fallback={
                      <div className="p-6 bg-white rounded-lg shadow-sm">
                        Loading map...
                      </div>
                    }
                  >
                    <MapCard />
                  </Suspense>
                </div>
              </TabsContent>

              <TabsContent value="carbon">
                <div className="mt-4">
                  <Suspense
                    fallback={
                      <div className="p-6 bg-white rounded-lg shadow-sm">
                        Loading charts...
                      </div>
                    }
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <CarbonWalletCard
                        credits={Math.round(totalCredits)}
                        co2={Math.round(totalCredits * 0.5)}
                      />
                      <Card className="rounded-2xl shadow-sm">
                        <CardHeader>
                          <CardTitle>Carbon Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm text-gray-700">
                            Credits per hectare: 2.5
                          </div>
                          <div className="text-sm text-gray-700">
                            Price per credit: ₹500
                          </div>
                          <div className="mt-2 text-lg font-semibold">
                            Estimated Credits: {Math.round(totalCredits)}
                          </div>
                          <div className="text-lg font-semibold text-[#795548]">
                            Estimated Income: ₹{Math.round(estimatedIncome)}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </Suspense>
                </div>
              </TabsContent>

              <TabsContent value="profile">
                <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Suspense fallback={<div className="p-6 bg-white rounded-lg shadow-sm">Loading profile editor...</div>}>
                    <ProfileEditor onUpdate={() => window.location.reload()} />
                  </Suspense>

                  <Card className="rounded-2xl shadow-sm">
                    <CardHeader>
                      <CardTitle>Update Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name2">Full Name</Label>
                            <Input id="name2" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                          </div>
                          <div>
                            <Label htmlFor="phone2">Phone</Label>
                            <Input id="phone2" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button type="submit" className="bg-[#4CAF50]">Save</Button>
                          <Button variant="outline">Cancel</Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <BottomNav />
      </div>
    </div>
  );
}
