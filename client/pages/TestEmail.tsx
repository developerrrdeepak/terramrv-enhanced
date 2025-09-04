import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface EmailTestResponse {
  success: boolean;
  message: string;
  email_service: {
    configured: boolean;
    provider: string;
  };
  test_data?: {
    email: string;
    otp?: string;
    farmer_name?: string;
    estimated_income?: number;
    type: string;
  };
}

export default function TestEmail() {
  const [email, setEmail] = useState("test@example.com");
  const [loading, setLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState<any>(null);
  const [lastResult, setLastResult] = useState<EmailTestResponse | null>(null);

  const checkEmailStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/test/email-status");
      const data = await response.json();
      setEmailStatus(data);
      toast.success("Email service status checked");
    } catch (error) {
      toast.error("Failed to check email service status");
      console.error("Email status error:", error);
    } finally {
      setLoading(false);
    }
  };

  const testEmail = async (type: "otp" | "welcome") => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/test/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, type }),
      });

      const data: EmailTestResponse = await response.json();
      setLastResult(data);

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to send test email");
      console.error("Test email error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📧 Email Service Test Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            SendGrid integration testing for TerraMRV
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Email Service Status */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🔧 Email Service Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={checkEmailStatus}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Checking..." : "Check Service Status"}
              </Button>

              {emailStatus && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Provider:</span>
                    <Badge
                      variant={
                        emailStatus.email_service?.configured
                          ? "default"
                          : "secondary"
                      }
                    >
                      {emailStatus.email_service?.provider || "Unknown"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Status:</span>
                    <Badge
                      variant={
                        emailStatus.email_service?.configured
                          ? "default"
                          : "destructive"
                      }
                    >
                      {emailStatus.email_service?.configured
                        ? "Configured"
                        : "Not Configured"}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    Last checked:{" "}
                    {new Date(emailStatus.timestamp).toLocaleString()}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Email Testing */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🧪 Test Email Sending
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="test@example.com"
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => testEmail("otp")}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? "Sending..." : "📱 Send Test OTP Email"}
                </Button>

                <Button
                  onClick={() => testEmail("welcome")}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {loading ? "Sending..." : "🎉 Send Test Welcome Email"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Last Test Result */}
        {lastResult && (
          <Card className="shadow-lg mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📋 Last Test Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Success:</span>
                  <Badge
                    variant={lastResult.success ? "default" : "destructive"}
                  >
                    {lastResult.success ? "Yes" : "No"}
                  </Badge>
                </div>

                <div>
                  <span className="font-medium">Message:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    {lastResult.message}
                  </p>
                </div>

                <Separator />

                <div>
                  <span className="font-medium">Email Service:</span>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Provider:</span>
                      <span className="text-sm font-mono">
                        {lastResult.email_service.provider}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Configured:</span>
                      <Badge
                        variant={
                          lastResult.email_service.configured
                            ? "default"
                            : "destructive"
                        }
                        className="text-xs"
                      >
                        {lastResult.email_service.configured ? "Yes" : "No"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {lastResult.test_data && (
                  <>
                    <Separator />
                    <div>
                      <span className="font-medium">Test Data:</span>
                      <div className="mt-2 bg-gray-50 p-3 rounded-lg text-sm font-mono">
                        <div>Email: {lastResult.test_data.email}</div>
                        <div>Type: {lastResult.test_data.type}</div>
                        {lastResult.test_data.otp && (
                          <div>OTP: {lastResult.test_data.otp}</div>
                        )}
                        {lastResult.test_data.farmer_name && (
                          <div>Farmer: {lastResult.test_data.farmer_name}</div>
                        )}
                        {lastResult.test_data.estimated_income && (
                          <div>
                            Income: ₹
                            {lastResult.test_data.estimated_income.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="shadow-lg mt-6 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              📝 Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-700">
            <div className="space-y-2 text-sm">
              <p>
                • <strong>Check Service Status:</strong> Verify if SendGrid is
                properly configured
              </p>
              <p>
                • <strong>Test OTP Email:</strong> Sends a verification code
                email (like for login)
              </p>
              <p>
                • <strong>Test Welcome Email:</strong> Sends a farmer onboarding
                email with income estimate
              </p>
              <p>
                • If SendGrid is not configured, emails will be logged to
                console instead
              </p>
              <p>
                • Check the browser console and server logs for detailed
                information
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Access */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm mb-4">
            This page is only available in development mode
          </p>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
