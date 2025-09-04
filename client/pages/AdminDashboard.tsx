import { useState, useMemo, useEffect, useRef } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Users,
  FileText,
  TreePine,
  BarChart3,
  Download,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  IndianRupee,
  MapPin,
  Filter,
  Search,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";

// Mock data - in real app this would come from API
const mockFarmers = [
  {
    id: "1",
    name: "Rajesh Kumar",
    email: "rajesh@example.com",
    phone: "+91 98765 43210",
    location: "Punjab",
    landSize: 5.2,
    status: "verified",
    carbonCredits: 12.5,
    joinedDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Priya Sharma",
    email: "priya@example.com",
    phone: "+91 87654 32109",
    location: "Haryana",
    landSize: 3.8,
    status: "pending",
    carbonCredits: 0,
    joinedDate: "2024-02-20",
  },
  {
    id: "3",
    name: "Amit Singh",
    email: "amit@example.com",
    phone: "+91 76543 21098",
    location: "Uttar Pradesh",
    landSize: 7.1,
    status: "verified",
    carbonCredits: 18.7,
    joinedDate: "2024-01-08",
  },
];

const mockProjects = [
  {
    id: "1",
    name: "Agroforestry Initiative",
    type: "agroforestry",
    participants: 45,
    totalCredits: 567.8,
    status: "active",
    createdDate: "2024-01-01",
  },
  {
    id: "2",
    name: "Rice Carbon Project",
    type: "rice_based",
    participants: 23,
    totalCredits: 234.5,
    status: "active",
    createdDate: "2024-02-01",
  },
];

export default function AdminDashboard() {
  const { user, isAuthenticated, farmerRegister } = useAuth();
  const [farmers, setFarmers] = useState(mockFarmers);
  const [projects, setProjects] = useState(mockProjects);
  const [selectedFarmer, setSelectedFarmer] = useState<any>(null);
  const [newProject, setNewProject] = useState({
    name: "",
    type: "",
    description: "",
    creditRate: "",
    requirements: "",
  });
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [showAddFarmerDialog, setShowAddFarmerDialog] = useState(false);
  const [addFarmerData, setAddFarmerData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined,
  );

  // approvals data
  const [credits, setCredits] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const isMounted = useRef(true);

  const fetchApprovals = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const [cRes, pRes] = await Promise.all([
        fetch("/api/admin/credits", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/admin/payouts", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      if (cRes.ok) {
        const data = await cRes.json();
        if (isMounted.current) setCredits(data.credits || []);
      }
      if (pRes.ok) {
        const data = await pRes.json();
        if (isMounted.current) setPayouts(data.payouts || []);
      }
    } catch (error) {
      console.error("Failed to fetch approvals:", error);
    }
  };

  useEffect(() => {
    fetchApprovals();
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredFarmers = useMemo(() => {
    return farmers.filter((f) => {
      const matchesQuery =
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter ? f.status === statusFilter : true;
      return matchesQuery && matchesStatus;
    });
  }, [farmers, searchQuery, statusFilter]);

  const growthData = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => ({
        month: new Date(
          new Date().setMonth(new Date().getMonth() - (5 - i)),
        ).toLocaleString("en-US", { month: "short" }),
        farmers: Math.floor(20 + i * 8 + (i % 2 ? 5 : 0)),
        credits: Math.round(200 + i * 60 + (i % 2 ? 40 : 0)),
      })),
    [],
  );

  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (user?.type !== "admin") {
    const fallback = user?.type === "farmer" ? "/farmer-dashboard" : "/";
    return <Navigate to={fallback} replace />;
  }

  const handleFarmerStatusUpdate = (farmerId: string, newStatus: string) => {
    setFarmers((prev) =>
      prev.map((farmer) =>
        farmer.id === farmerId ? { ...farmer, status: newStatus } : farmer,
      ),
    );
    toast.success(`Farmer status updated to ${newStatus}`);
  };

  const handleCreateProject = () => {
    if (!newProject.name || !newProject.type) {
      toast.error("Please fill in required fields");
      return;
    }

    const project = {
      id: Date.now().toString(),
      ...newProject,
      participants: 0,
      totalCredits: 0,
      status: "active",
      createdDate: new Date().toISOString().split("T")[0],
    };

    setProjects((prev) => [...prev, project]);
    setNewProject({
      name: "",
      type: "",
      description: "",
      creditRate: "",
      requirements: "",
    });
    setShowNewProjectDialog(false);
    toast.success("Project created successfully!");
  };

  const exportReport = (type: string) => {
    // Mock export functionality
    toast.success(`${type} report exported successfully!`);
  };

  const calculateStats = () => {
    const totalFarmers = farmers.length;
    const verifiedFarmers = farmers.filter(
      (f) => f.status === "verified",
    ).length;
    const totalCredits = farmers.reduce(
      (sum, f) => sum + (f.carbonCredits || 0),
      0,
    );
    const totalLand = farmers.reduce((sum, f) => sum + (f.landSize || 0), 0);

    return { totalFarmers, verifiedFarmers, totalCredits, totalLand };
  };

  const stats = calculateStats();

  // Approvals actions
  const approveCredit = async (creditId: string, approve = true) => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch("/api/admin/credits/approve", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ creditId, approve }),
      });
      if (res.ok) {
        toast.success("Credit updated");
        fetchApprovals();
      } else {
        const txt = await res.text();
        toast.error(`Failed: ${txt}`);
      }
    } catch (e) {
      console.error(e);
      toast.error("Network error");
    }
  };

  const markPayoutPaid = async (payoutId: string) => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch("/api/admin/payouts/mark-paid", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ payoutId }),
      });
      if (res.ok) {
        toast.success("Payout marked as paid");
        fetchApprovals();
      } else {
        const txt = await res.text();
        toast.error(`Failed: ${txt}`);
      }
    } catch (e) {
      console.error(e);
      toast.error("Network error");
    }
  };

  const handleAddFarmer = async () => {
    try {
      if (!addFarmerData.email || !addFarmerData.password) {
        toast.error("Email and password required");
        return;
      }
      const result = await farmerRegister({
        email: addFarmerData.email,
        password: addFarmerData.password,
        name: addFarmerData.name,
        phone: addFarmerData.phone,
      } as any);

      if (result.success) {
        toast.success("Farmer created and authenticated");
        setShowAddFarmerDialog(false);
        // Refresh local list (in real app fetch from server)
        setFarmers((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            name: addFarmerData.name || addFarmerData.email.split("@")[0],
            email: addFarmerData.email,
            phone: addFarmerData.phone,
            location: "",
            landSize: 0,
            status: "verified",
            carbonCredits: 0,
            joinedDate: new Date().toISOString().split("T")[0],
          },
        ]);
      } else {
        toast.error(result.message || "Failed to create farmer");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error");
    }
  };

  const uploadKycForSelectedFarmer = async (file?: File) => {
    if (!selectedFarmer) return;
    try {
      let docs: any[] = [];
      if (file) {
        const reader = new FileReader();
        const asBase64: string = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        docs.push({ filename: file.name, data: asBase64, type: "kyc" });
      } else {
        // No file provided - mock a sample doc
        docs.push({
          filename: `kyc_${Date.now()}.txt`,
          data: btoa("sample"),
          type: "kyc",
        });
      }

      const token = localStorage.getItem("auth_token");
      const res = await fetch("/api/auth/upload-kyc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ docs }),
      });
      if (res.ok) {
        const data = await res.json();
        toast.success("KYC uploaded");
        setSelectedFarmer({ ...selectedFarmer, kyc: data.docs });
      } else {
        const txt = await res.text();
        toast.error(`Upload failed: ${txt}`);
      }
    } catch (e) {
      console.error(e);
      toast.error("Upload error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Welcome, {user?.admin?.name || user?.admin?.email}
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Input
                  placeholder="Search farmers, email, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
                <Search className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v)}
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Stats + Trends */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Farmers
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalFarmers}
                  </p>
                </div>
                <Users className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-white border-emerald-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Verified Farmers
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {stats.verifiedFarmers}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-50 to-white border-emerald-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Credits
                  </p>
                  <p className="text-3xl font-bold text-emerald-600">
                    {stats.totalCredits.toFixed(1)}
                  </p>
                </div>
                <TreePine className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Land (Ha)
                  </p>
                  <p className="text-3xl font-bold text-amber-600">
                    {stats.totalLand.toFixed(1)}
                  </p>
                </div>
                <MapPin className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          <Card className="xl:col-span-2 border-emerald-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" /> Trends
              </CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData} margin={{ left: -20, right: 10 }}>
                  <defs>
                    <linearGradient
                      id="colorFarmers"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorCredits"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="farmers"
                    stroke="#059669"
                    fill="url(#colorFarmers)"
                    name="Farmers"
                  />
                  <Area
                    type="monotone"
                    dataKey="credits"
                    stroke="#f59e0b"
                    fill="url(#colorCredits)"
                    name="Credits"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-emerald-100">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button
                className="w-full"
                onClick={() => setShowNewProjectDialog(true)}
              >
                Create Project
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowAddFarmerDialog(true)}
              >
                Add / Onboard Farmer
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => exportReport("Farmers")}
              >
                Export Reports
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="farmers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="farmers">Farmer Management</TabsTrigger>
            <TabsTrigger value="projects">Project Management</TabsTrigger>
            <TabsTrigger value="mrv">MRV Tools</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="farmers">
            <Card className="bg-white/90 border border-emerald-100 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Farmer Management</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setStatusFilter(undefined)}
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Reset Filters
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportReport("Farmers")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Land Size</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Credits</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFarmers.map((farmer) => (
                      <TableRow key={farmer.id}>
                        <TableCell className="font-medium">
                          {farmer.name}
                        </TableCell>
                        <TableCell>{farmer.email}</TableCell>
                        <TableCell>{farmer.location}</TableCell>
                        <TableCell>{farmer.landSize} Ha</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              farmer.status === "verified"
                                ? "default"
                                : farmer.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {farmer.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{farmer.carbonCredits}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedFarmer(farmer)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {farmer.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleFarmerStatusUpdate(
                                      farmer.id,
                                      "verified",
                                    )
                                  }
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() =>
                                    handleFarmerStatusUpdate(
                                      farmer.id,
                                      "rejected",
                                    )
                                  }
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            <Card className="bg-white/90 border border-emerald-100 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TreePine className="h-5 w-5" />
                    <span>Project Management</span>
                  </div>
                  <Dialog
                    open={showNewProjectDialog}
                    onOpenChange={setShowNewProjectDialog}
                  >
                    <DialogTrigger asChild>
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Project
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Project</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="projectName">Project Name *</Label>
                          <Input
                            id="projectName"
                            value={newProject.name}
                            onChange={(e) =>
                              setNewProject({
                                ...newProject,
                                name: e.target.value,
                              })
                            }
                            placeholder="Enter project name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="projectType">Project Type *</Label>
                          <Select
                            onValueChange={(value) =>
                              setNewProject({ ...newProject, type: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select project type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="agroforestry">
                                Agroforestry
                              </SelectItem>
                              <SelectItem value="rice_based">
                                Rice Based
                              </SelectItem>
                              <SelectItem value="soil_carbon">
                                Soil Carbon
                              </SelectItem>
                              <SelectItem value="biomass">Biomass</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={newProject.description}
                            onChange={(e) =>
                              setNewProject({
                                ...newProject,
                                description: e.target.value,
                              })
                            }
                            placeholder="Enter project description"
                          />
                        </div>
                        <div>
                          <Label htmlFor="creditRate">
                            Credit Rate (per hectare)
                          </Label>
                          <Input
                            id="creditRate"
                            type="number"
                            step="0.1"
                            value={newProject.creditRate}
                            onChange={(e) =>
                              setNewProject({
                                ...newProject,
                                creditRate: e.target.value,
                              })
                            }
                            placeholder="Enter credit rate"
                          />
                        </div>
                        <div>
                          <Label htmlFor="requirements">Requirements</Label>
                          <Textarea
                            id="requirements"
                            value={newProject.requirements}
                            onChange={(e) =>
                              setNewProject({
                                ...newProject,
                                requirements: e.target.value,
                              })
                            }
                            placeholder="Enter project requirements"
                          />
                        </div>
                        <Button
                          onClick={handleCreateProject}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          Create Project
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map((project) => (
                    <Card
                      key={project.id}
                      className="bg-white border-l-4 border-l-green-500 shadow-sm"
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{project.name}</h3>
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700"
                            >
                              {project.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">
                                Participants:
                              </span>
                              <p className="font-medium">
                                {project.participants}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-600">
                                Total Credits:
                              </span>
                              <p className="font-medium">
                                {project.totalCredits}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-2">
                            <span className="text-xs text-gray-500">
                              Created: {project.createdDate}
                            </span>
                            <Button size="sm" variant="outline">
                              Manage
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mrv">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/90 border border-emerald-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Carbon Credit Calculator</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">
                          {stats.totalCredits.toFixed(1)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Total Credits Generated
                        </p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">
                          {(stats.totalCredits * 500).toLocaleString("en-IN")}
                        </p>
                        <p className="text-sm text-gray-600">
                          Total Value (INR)
                        </p>
                      </div>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => exportReport("Carbon Credits")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Credit Report
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 border border-emerald-100 shadow-sm">
                <CardHeader>
                  <CardTitle>Verification Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Eye className="h-4 w-4 mr-2" />
                      Satellite Data Analysis
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Field Verification Reports
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      IoT Sensor Data
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      AI Verification Engine
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Approvals: Credits & Payouts */}
              <Card className="bg-white/90 border border-emerald-100 shadow-sm md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5" />
                      <span>Approvals</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={fetchApprovals}
                      >
                        Refresh
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Pending Credits</h4>
                      {credits.length === 0 && (
                        <p className="text-sm text-gray-500">
                          No pending credits
                        </p>
                      )}
                      {credits.map((c) => (
                        <div
                          key={c.id}
                          className="p-3 border rounded mb-2 flex items-center justify-between"
                        >
                          <div>
                            <div className="font-medium">
                              {c.farmerName} — {c.project}
                            </div>
                            <div className="text-sm text-gray-600">
                              Amount: {c.amount} credits
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => approveCredit(c.id, true)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => approveCredit(c.id, false)}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Payouts</h4>
                      {payouts.length === 0 && (
                        <p className="text-sm text-gray-500">
                          No pending payouts
                        </p>
                      )}
                      {payouts.map((p) => (
                        <div
                          key={p.id}
                          className="p-3 border rounded mb-2 flex items-center justify-between"
                        >
                          <div>
                            <div className="font-medium">{p.farmerName}</div>
                            <div className="text-sm text-gray-600">
                              Amount: ₹{p.amount}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => markPayoutPaid(p.id)}
                            >
                              <IndianRupee className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports">
            <Card className="bg-gradient-to-br from-white to-indigo-50 border-indigo-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Reporting & Export</span>
                </CardTitle>
                <CardDescription>
                  Generate and export MRV reports for stakeholders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="p-4 bg-white border border-emerald-100 shadow-sm">
                    <h3 className="font-semibold mb-2">Farmer Report</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Comprehensive farmer data and verification status
                    </p>
                    <div className="space-y-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => exportReport("PDF Farmer")}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export PDF
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => exportReport("Excel Farmer")}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export Excel
                      </Button>
                    </div>
                  </Card>

                  <Card className="p-4 bg-white border border-emerald-100 shadow-sm">
                    <h3 className="font-semibold mb-2">Carbon Credit Report</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Detailed carbon credit calculations and verification
                    </p>
                    <div className="space-y-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => exportReport("PDF Carbon")}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export PDF
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => exportReport("Excel Carbon")}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export Excel
                      </Button>
                    </div>
                  </Card>

                  <Card className="p-4 bg-white border border-emerald-100 shadow-sm">
                    <h3 className="font-semibold mb-2">Project Report</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Project performance and participant data
                    </p>
                    <div className="space-y-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => exportReport("PDF Project")}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export PDF
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => exportReport("Excel Project")}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export Excel
                      </Button>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Farmer Details Modal */}
        {selectedFarmer && (
          <Dialog
            open={!!selectedFarmer}
            onOpenChange={() => setSelectedFarmer(null)}
          >
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  Farmer Details - {selectedFarmer.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Email</Label>
                    <p className="text-sm text-gray-600">
                      {selectedFarmer.email}
                    </p>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <p className="text-sm text-gray-600">
                      {selectedFarmer.phone}
                    </p>
                  </div>
                  <div>
                    <Label>Location</Label>
                    <p className="text-sm text-gray-600">
                      {selectedFarmer.location}
                    </p>
                  </div>
                  <div>
                    <Label>Land Size</Label>
                    <p className="text-sm text-gray-600">
                      {selectedFarmer.landSize} hectares
                    </p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge
                      variant={
                        selectedFarmer.status === "verified"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {selectedFarmer.status}
                    </Badge>
                  </div>
                  <div>
                    <Label>Carbon Credits</Label>
                    <p className="text-sm text-gray-600">
                      {selectedFarmer.carbonCredits}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id="kycFile"
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) uploadKycForSelectedFarmer(f);
                    }}
                  />
                  <Button onClick={() => uploadKycForSelectedFarmer()}>
                    Upload Sample KYC
                  </Button>
                </div>

                {selectedFarmer.status === "pending" && (
                  <div className="flex space-x-2 pt-4">
                    <Button
                      onClick={() => {
                        handleFarmerStatusUpdate(selectedFarmer.id, "verified");
                        setSelectedFarmer(null);
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleFarmerStatusUpdate(selectedFarmer.id, "rejected");
                        setSelectedFarmer(null);
                      }}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Create Farmer Dialog */}
        <Dialog
          open={showAddFarmerDialog}
          onOpenChange={setShowAddFarmerDialog}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add / Onboard Farmer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="farmerEmail">Email</Label>
                <Input
                  id="farmerEmail"
                  value={addFarmerData.email}
                  onChange={(e) =>
                    setAddFarmerData({
                      ...addFarmerData,
                      email: e.target.value,
                    })
                  }
                  placeholder="farmer@example.com"
                />
              </div>
              <div>
                <Label htmlFor="farmerName">Name</Label>
                <Input
                  id="farmerName"
                  value={addFarmerData.name}
                  onChange={(e) =>
                    setAddFarmerData({ ...addFarmerData, name: e.target.value })
                  }
                  placeholder="Name"
                />
              </div>
              <div>
                <Label htmlFor="farmerPhone">Phone</Label>
                <Input
                  id="farmerPhone"
                  value={addFarmerData.phone}
                  onChange={(e) =>
                    setAddFarmerData({
                      ...addFarmerData,
                      phone: e.target.value,
                    })
                  }
                  placeholder="Phone"
                />
              </div>
              <div>
                <Label htmlFor="farmerPassword">Password</Label>
                <Input
                  id="farmerPassword"
                  type="password"
                  value={addFarmerData.password}
                  onChange={(e) =>
                    setAddFarmerData({
                      ...addFarmerData,
                      password: e.target.value,
                    })
                  }
                  placeholder="Password"
                />
              </div>
              <Button
                onClick={handleAddFarmer}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Create Farmer
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* New Project Dialog handled earlier */}
      </div>
    </div>
  );
}
