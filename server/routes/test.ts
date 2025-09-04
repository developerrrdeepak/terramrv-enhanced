import { RequestHandler } from "express";
import EmailService from "../lib/emailService";

export const testEmail: RequestHandler = async (req, res) => {
  try {
    const { email, type = "otp" } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const emailService = EmailService.getInstance();
    const emailStatus = emailService.getStatus();

    if (type === "otp") {
      // Test OTP email
      const testOTP = "123456";
      const result = await emailService.sendOTPEmail(email, testOTP);

      res.json({
        success: result,
        message: result
          ? "Test OTP email sent successfully"
          : "Failed to send test OTP email",
        email_service: emailStatus,
        test_data: {
          email,
          otp: testOTP,
          type: "OTP Verification",
        },
      });
    } else if (type === "welcome") {
      // Test Welcome email
      const result = await emailService.sendWelcomeEmail(
        email,
        "Test Farmer",
        15000,
      );

      res.json({
        success: result,
        message: result
          ? "Test welcome email sent successfully"
          : "Failed to send test welcome email",
        email_service: emailStatus,
        test_data: {
          email,
          farmer_name: "Test Farmer",
          estimated_income: 15000,
          type: "Welcome Email",
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid test type. Use 'otp' or 'welcome'",
      });
    }
  } catch (error) {
    console.error("❌ [EMAIL TEST] Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getEmailStatus: RequestHandler = async (req, res) => {
  try {
    const emailService = EmailService.getInstance();
    const status = emailService.getStatus();

    res.json({
      success: true,
      email_service: status,
      timestamp: new Date().toISOString(),
      available_tests: [
        'POST /api/test/email - {"email": "test@example.com", "type": "otp"}',
        'POST /api/test/email - {"email": "test@example.com", "type": "welcome"}',
        "GET /api/test/email-status - Get current email service status",
      ],
    });
  } catch (error) {
    console.error("❌ [EMAIL STATUS] Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get email service status",
    });
  }
};
