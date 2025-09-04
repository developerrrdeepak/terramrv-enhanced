import { useEffect, useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/AuthModal";

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!open && !isAuthenticated) {
      const from = (location.state as any)?.from || "/";
      navigate(from, { replace: true });
    }
  }, [open, isAuthenticated, navigate, location.state]);

  if (isAuthenticated) {
    const path =
      user?.type === "admin" ? "/admin-dashboard" : "/farmer-dashboard";
    return <Navigate to={path} replace />;
  }

  return (
    <div className="min-h-[60vh]">
      <AuthModal
        open={open}
        onOpenChange={setOpen}
        initialTab="farmer"
        defaultFarmerAuthType="password"
        defaultIsRegistering
      />
    </div>
  );
}
