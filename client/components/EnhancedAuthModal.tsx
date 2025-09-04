import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  User,
  MapPin,
  Wheat,
  TreePine,
  Phone,
  Mail,
  CreditCard,
  Camera,
  Navigation,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Upload,
  Leaf,
  Sprout,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EnhancedAuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FarmerRegistrationData {
  // Step 1: Basic Info
  email: string;
  otp: string;
  name: string;
  phone: string;

  // Step 2: Farm Details
  farmName: string;
  landSize: number;
  landUnit: "acres" | "hectares";
  farmingType: "organic" | "conventional" | "mixed";
  primaryCrops: string[];
  irrigationType: "rain_fed" | "canal" | "borewell" | "drip" | "sprinkler";

  // Step 3: Location
  address: string;
  pincode: string;
  state: string;
  district: string;
  latitude?: number;
  longitude?: number;

  // Step 4: Documents
  aadhaarNumber?: string;
  panNumber?: string;
  bankAccountNumber?: string;
  ifscCode?: string;

  // Step 5: Carbon Projects Interest
  interestedProjects: string[];
  sustainablePractices: string[];
  estimatedIncome?: number;
}

const cropOptions = [
  "Rice (धान)",
  "Wheat (गेहूं)",
  "Sugarcane (गन्ना)",
  "Cotton (कपास)",
  "Pulses (दालें)",
  "Oilseeds (तिलहन)",
  "Maize (मक्का)",
  "Bajra (बाजरा)",
  "Jowar (ज्वार)",
  "Barley (जौ)",
  "Vegetables (सब्जियां)",
  "Fruits (फल)",
  "Spices (मसाले)",
  "Tea (चाय)",
  "Coffee (कॉफी)",
  "Rubber (रबर)",
];

const sustainablePractices = [
  "Agroforestry",
  "Zero Tillage",
  "Crop Rotation",
  "Organic Farming",
  "Water Conservation",
  "Soil Health Management",
  "Integrated Pest Management",
  "Renewable Energy Use",
  "Waste Composting",
  "Cover Cropping",
];

const carbonProjects = [
  "Rice-based Carbon Credits",
  "Agroforestry Projects",
  "Soil Carbon Enhancement",
  "Methane Reduction",
  "Biomass Management",
  "Water Conservation Projects",
];

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export default function EnhancedAuthModal({
  open,
  onOpenChange,
}: EnhancedAuthModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps] = useState(5);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState("");
  const [adminCredentials, setAdminCredentials] = useState({
    email: "",
    password: "",
  });

  const [registrationData, setRegistrationData] =
    useState<FarmerRegistrationData>({
      email: "",
      otp: "",
      name: "",
      phone: "",
      farmName: "",
      landSize: 0,
      landUnit: "acres",
      farmingType: "conventional",
      primaryCrops: [],
      irrigationType: "rain_fed",
      address: "",
      pincode: "",
      state: "",
      district: "",
      interestedProjects: [],
      sustainablePractices: [],
    });

  const { sendOTP, verifyOTP, adminLogin } = useAuth();
  const navigate = useNavigate();

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setRegistrationData((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
          setLoading(false);
          toast.success("Location captured successfully! 📍");
        },
        (error) => {
          setLoading(false);
          toast.error("Unable to get location. Please enter manually.");
        },
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  const calculateProgress = () => {
    return ((currentStep - 1) / (totalSteps - 1)) * 100;
  };

  const handleSendOTP = async () => {
    if (!registrationData.email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const result = await sendOTP({ email: registrationData.email });
      if (result.success) {
        setOtpSent(true);
        setGeneratedOTP(result.otp || "");
        toast.success("OTP sent to your email");
      } else {
        toast.error(result.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("Failed to send OTP");
    }
    setLoading(false);
  };

  const handleVerifyAndNext = async () => {
    if (!registrationData.otp) {
      toast.error("Please enter the OTP");
      return;
    }

    setLoading(true);
    try {
      const result = await verifyOTP({
        email: registrationData.email,
        otp: registrationData.otp,
      });
      if (result.success) {
        toast.success("Email verified! Continue with registration.");
        setCurrentStep(2);
      } else {
        toast.error(result.message || "Invalid OTP");
      }
    } catch (error) {
      toast.error("Failed to verify OTP");
    }
    setLoading(false);
  };

  const handleAdminLogin = async () => {
    if (!adminCredentials.email || !adminCredentials.password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const result = await adminLogin(adminCredentials);
      if (result.success) {
        toast.success("Admin login successful!");
        onOpenChange(false);
        navigate("/admin-dashboard");
      } else {
        toast.error(result.message || "Invalid credentials");
      }
    } catch (error) {
      toast.error("Failed to login");
    }
    setLoading(false);
  };

  const handleNextStep = () => {
    // Validation for each step
    switch (currentStep) {
      case 2:
        if (!registrationData.name || !registrationData.phone) {
          toast.error("Please fill all required fields");
          return;
        }
        break;
      case 3:
        if (!registrationData.farmName || registrationData.landSize <= 0) {
          toast.error("Please fill all required farm details");
          return;
        }
        break;
      case 4:
        if (
          !registrationData.address ||
          !registrationData.pincode ||
          !registrationData.state
        ) {
          toast.error("Please fill all required location details");
          return;
        }
        break;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinalSubmit = async () => {
    setLoading(true);

    try {
      // Send complete registration data with OTP verification
      const result = await verifyOTP({
        email: registrationData.email,
        otp: registrationData.otp,
        registrationData: {
          name: registrationData.name,
          phone: registrationData.phone,
          farmName: registrationData.farmName,
          landSize: registrationData.landSize,
          landUnit: registrationData.landUnit,
          farmingType: registrationData.farmingType,
          primaryCrops: registrationData.primaryCrops,
          irrigationType: registrationData.irrigationType,
          address: registrationData.address,
          pincode: registrationData.pincode,
          state: registrationData.state,
          district: registrationData.district,
          latitude: registrationData.latitude,
          longitude: registrationData.longitude,
          aadhaarNumber: registrationData.aadhaarNumber,
          panNumber: registrationData.panNumber,
          bankAccountNumber: registrationData.bankAccountNumber,
          ifscCode: registrationData.ifscCode,
          interestedProjects: registrationData.interestedProjects,
          sustainablePractices: registrationData.sustainablePractices,
        },
      });

      if (result.success) {
        toast.success("🎉 Registration completed successfully!");
        if (result.user?.farmer?.estimatedIncome) {
          toast.success(
            `💰 Estimated annual carbon income: ₹${result.user.farmer.estimatedIncome.toLocaleString()}`,
          );
        }
        onOpenChange(false);
        navigate("/farmer-dashboard");
      } else {
        toast.error(result.message || "Registration failed");
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    }
    setLoading(false);
  };

  const resetForm = () => {
    setCurrentStep(1);
    setOtpSent(false);
    setGeneratedOTP("");
    setRegistrationData({
      email: "",
      otp: "",
      name: "",
      phone: "",
      farmName: "",
      landSize: 0,
      landUnit: "acres",
      farmingType: "conventional",
      primaryCrops: [],
      irrigationType: "rain_fed",
      address: "",
      pincode: "",
      state: "",
      district: "",
      interestedProjects: [],
      sustainablePractices: [],
    });
    setAdminCredentials({ email: "", password: "" });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) resetForm();
      }}
    >
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Welcome to TerraMRV
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="farmer" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="farmer" className="flex items-center space-x-2">
              <Wheat className="h-4 w-4" />
              <span>👨‍🌾 Farmer Registration</span>
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>👨‍💻 Admin Login</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="farmer" className="mt-6">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-600">
                  Step {currentStep} of {totalSteps}
                </span>
                <span className="text-sm font-medium text-emerald-600">
                  {Math.round(calculateProgress())}% Complete
                </span>
              </div>
              <Progress value={calculateProgress()} className="h-3" />

              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span
                  className={
                    currentStep >= 1 ? "text-emerald-600 font-medium" : ""
                  }
                >
                  Email
                </span>
                <span
                  className={
                    currentStep >= 2 ? "text-emerald-600 font-medium" : ""
                  }
                >
                  Personal
                </span>
                <span
                  className={
                    currentStep >= 3 ? "text-emerald-600 font-medium" : ""
                  }
                >
                  Farm
                </span>
                <span
                  className={
                    currentStep >= 4 ? "text-emerald-600 font-medium" : ""
                  }
                >
                  Location
                </span>
                <span
                  className={
                    currentStep >= 5 ? "text-emerald-600 font-medium" : ""
                  }
                >
                  Complete
                </span>
              </div>
            </div>

            {/* Step 1: Email Verification */}
            {currentStep === 1 && (
              <Card className="border-green-200">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Mail className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle>Email Verification</CardTitle>
                  <p className="text-gray-600">
                    Let's start with verifying your email address
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!otpSent ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="farmer@example.com"
                          value={registrationData.email}
                          onChange={(e) =>
                            setRegistrationData((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <Button
                        onClick={handleSendOTP}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-amber-500"
                      >
                        {loading ? "Sending..." : "Send OTP"}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="otp">Enter OTP *</Label>
                        <Input
                          id="otp"
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          value={registrationData.otp}
                          onChange={(e) =>
                            setRegistrationData((prev) => ({
                              ...prev,
                              otp: e.target.value,
                            }))
                          }
                          maxLength={6}
                        />
                        <p className="text-sm text-gray-600 mt-1">
                          OTP sent to {registrationData.email}
                        </p>
                        {generatedOTP && (
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md mt-2">
                            <p className="text-sm font-medium text-blue-800">
                              🔐 Your OTP:{" "}
                              <span className="font-mono text-lg">
                                {generatedOTP}
                              </span>
                            </p>
                            <p className="text-xs text-blue-600 mt-1">
                              (For testing purposes only)
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Button
                          onClick={handleVerifyAndNext}
                          disabled={loading}
                          className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-amber-500"
                        >
                          {loading ? "Verifying..." : "Verify & Continue"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setOtpSent(false)}
                          className="w-full"
                        >
                          Change Email
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 2: Personal Information */}
            {currentStep === 2 && (
              <Card className="border-blue-200">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle>Personal Information</CardTitle>
                  <p className="text-gray-600">Tell us about yourself</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={registrationData.name}
                        onChange={(e) =>
                          setRegistrationData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        placeholder="9876543210"
                        value={registrationData.phone}
                        onChange={(e) =>
                          setRegistrationData((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={handlePrevStep}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                    <Button
                      onClick={handleNextStep}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Farm Details */}
            {currentStep === 3 && (
              <Card className="border-emerald-200">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                    <Wheat className="h-8 w-8 text-emerald-600" />
                  </div>
                  <CardTitle>Farm Details</CardTitle>
                  <p className="text-gray-600">
                    Information about your farming operation
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="farmName">Farm/Field Name *</Label>
                    <Input
                      id="farmName"
                      placeholder="e.g., Green Valley Farm"
                      value={registrationData.farmName}
                      onChange={(e) =>
                        setRegistrationData((prev) => ({
                          ...prev,
                          farmName: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="landSize">Total Land Size *</Label>
                      <Input
                        id="landSize"
                        type="number"
                        placeholder="5"
                        value={registrationData.landSize || ""}
                        onChange={(e) =>
                          setRegistrationData((prev) => ({
                            ...prev,
                            landSize: parseFloat(e.target.value) || 0,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="landUnit">Unit</Label>
                      <Select
                        value={registrationData.landUnit}
                        onValueChange={(value: "acres" | "hectares") =>
                          setRegistrationData((prev) => ({
                            ...prev,
                            landUnit: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="acres">Acres</SelectItem>
                          <SelectItem value="hectares">Hectares</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="farmingType">Farming Type</Label>
                      <Select
                        value={registrationData.farmingType}
                        onValueChange={(
                          value: "organic" | "conventional" | "mixed",
                        ) =>
                          setRegistrationData((prev) => ({
                            ...prev,
                            farmingType: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="organic">Organic</SelectItem>
                          <SelectItem value="conventional">
                            Conventional
                          </SelectItem>
                          <SelectItem value="mixed">Mixed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="irrigationType">Irrigation Type</Label>
                      <Select
                        value={registrationData.irrigationType}
                        onValueChange={(value: any) =>
                          setRegistrationData((prev) => ({
                            ...prev,
                            irrigationType: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rain_fed">Rain Fed</SelectItem>
                          <SelectItem value="canal">Canal</SelectItem>
                          <SelectItem value="borewell">Borewell</SelectItem>
                          <SelectItem value="drip">Drip Irrigation</SelectItem>
                          <SelectItem value="sprinkler">Sprinkler</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Primary Crops (Select multiple)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 max-h-40 overflow-y-auto">
                      {cropOptions.map((crop) => (
                        <label
                          key={crop}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={registrationData.primaryCrops.includes(
                              crop,
                            )}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setRegistrationData((prev) => ({
                                  ...prev,
                                  primaryCrops: [...prev.primaryCrops, crop],
                                }));
                              } else {
                                setRegistrationData((prev) => ({
                                  ...prev,
                                  primaryCrops: prev.primaryCrops.filter(
                                    (c) => c !== crop,
                                  ),
                                }));
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">{crop}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={handlePrevStep}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                    <Button
                      onClick={handleNextStep}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Location Details */}
            {currentStep === 4 && (
              <Card className="border-amber-200">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                    <MapPin className="h-8 w-8 text-amber-600" />
                  </div>
                  <CardTitle>Farm Location</CardTitle>
                  <p className="text-gray-600">
                    Help us locate your farm for carbon monitoring
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address">Farm Address *</Label>
                    <Textarea
                      id="address"
                      placeholder="Village, Block/Tehsil details"
                      value={registrationData.address}
                      onChange={(e) =>
                        setRegistrationData((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      rows={3}
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="pincode">PIN Code *</Label>
                      <Input
                        id="pincode"
                        placeholder="400001"
                        value={registrationData.pincode}
                        onChange={(e) =>
                          setRegistrationData((prev) => ({
                            ...prev,
                            pincode: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Select
                        value={registrationData.state}
                        onValueChange={(value) =>
                          setRegistrationData((prev) => ({
                            ...prev,
                            state: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {indianStates.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="district">District</Label>
                      <Input
                        id="district"
                        placeholder="District name"
                        value={registrationData.district}
                        onChange={(e) =>
                          setRegistrationData((prev) => ({
                            ...prev,
                            district: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-blue-800">
                        GPS Coordinates
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={getCurrentLocation}
                        disabled={loading}
                        className="border-blue-300 text-blue-700 hover:bg-blue-100"
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        {loading ? "Getting..." : "Get Current Location"}
                      </Button>
                    </div>
                    {registrationData.latitude && registrationData.longitude ? (
                      <p className="text-sm text-blue-700">
                        📍 Location captured:{" "}
                        {registrationData.latitude.toFixed(6)},{" "}
                        {registrationData.longitude.toFixed(6)}
                      </p>
                    ) : (
                      <p className="text-sm text-blue-600">
                        Click "Get Current Location" for accurate carbon
                        monitoring
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={handlePrevStep}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                    <Button
                      onClick={handleNextStep}
                      className="bg-amber-600 hover:bg-amber-700"
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 5: Carbon Projects & Final */}
            {currentStep === 5 && (
              <Card className="border-green-200">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Leaf className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle>Carbon Projects Interest</CardTitle>
                  <p className="text-gray-600">
                    Choose projects you're interested in
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">
                      Interested Carbon Projects
                    </Label>
                    <div className="grid md:grid-cols-2 gap-3 mt-3">
                      {carbonProjects.map((project) => (
                        <label
                          key={project}
                          className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-green-50"
                        >
                          <input
                            type="checkbox"
                            checked={registrationData.interestedProjects.includes(
                              project,
                            )}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setRegistrationData((prev) => ({
                                  ...prev,
                                  interestedProjects: [
                                    ...prev.interestedProjects,
                                    project,
                                  ],
                                }));
                              } else {
                                setRegistrationData((prev) => ({
                                  ...prev,
                                  interestedProjects:
                                    prev.interestedProjects.filter(
                                      (p) => p !== project,
                                    ),
                                }));
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <span className="font-medium">{project}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">
                      Current Sustainable Practices
                    </Label>
                    <div className="grid md:grid-cols-2 gap-3 mt-3">
                      {sustainablePractices.map((practice) => (
                        <label
                          key={practice}
                          className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-emerald-50"
                        >
                          <input
                            type="checkbox"
                            checked={registrationData.sustainablePractices.includes(
                              practice,
                            )}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setRegistrationData((prev) => ({
                                  ...prev,
                                  sustainablePractices: [
                                    ...prev.sustainablePractices,
                                    practice,
                                  ],
                                }));
                              } else {
                                setRegistrationData((prev) => ({
                                  ...prev,
                                  sustainablePractices:
                                    prev.sustainablePractices.filter(
                                      (p) => p !== practice,
                                    ),
                                }));
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <span className="font-medium">{practice}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Registration Summary */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border-2 border-green-200">
                    <h3 className="font-bold text-lg text-green-800 mb-4 flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Registration Summary
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p>
                          <strong>Farmer:</strong> {registrationData.name}
                        </p>
                        <p>
                          <strong>Farm:</strong> {registrationData.farmName}
                        </p>
                        <p>
                          <strong>Size:</strong> {registrationData.landSize}{" "}
                          {registrationData.landUnit}
                        </p>
                      </div>
                      <div>
                        <p>
                          <strong>Location:</strong> {registrationData.state}
                        </p>
                        <p>
                          <strong>Crops:</strong>{" "}
                          {registrationData.primaryCrops.length} selected
                        </p>
                        <p>
                          <strong>Projects:</strong>{" "}
                          {registrationData.interestedProjects.length} selected
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={handlePrevStep}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                    <Button
                      onClick={handleFinalSubmit}
                      disabled={loading}
                      className="bg-gradient-to-r from-green-600 via-emerald-600 to-amber-500 text-white font-bold px-8"
                    >
                      {loading ? (
                        <>
                          <Sprout className="h-4 w-4 mr-2 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          Complete Registration
                          <CheckCircle className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="admin" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <User className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle>Admin Login</CardTitle>
                <p className="text-gray-600">Access administrative panel</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="admin-email">Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@example.com"
                    value={adminCredentials.email}
                    onChange={(e) =>
                      setAdminCredentials((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="admin-password">Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="Password"
                    value={adminCredentials.password}
                    onChange={(e) =>
                      setAdminCredentials((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                  />
                </div>
                <Button
                  onClick={handleAdminLogin}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
                >
                  {loading ? "Signing in..." : "Admin Login"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
