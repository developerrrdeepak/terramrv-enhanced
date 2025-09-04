import { useEffect, useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/AuthModal";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    // Only navigate back if modal closed WITHOUT logging in
    if (!open && !isAuthenticated) {
      const from = (location.state as any)?.from || "/";
      navigate(from, { replace: true });
    }
  }, [open, isAuthenticated, navigate, location.state]);

  // If already authenticated, send user to their dashboard
  if (isAuthenticated) {
    const path =
      user?.type === "admin" ? "/admin-dashboard" : "/farmer-dashboard";
    return <Navigate to={path} replace />;
  }

  return (
    <div className="min-h-[60vh]">
      <AuthModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
