import type { Handler } from "@netlify/functions";

// Simple in-memory storage for OTPs (in production, use a database)
const otpStore = new Map<string, { otp: string; timestamp: number }>();

// Admin credentials - must be set in environment variables
const DEFAULT_ADMIN = {
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
};

// Helper functions
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function generateJWT(payload: any): string {
  // Simple JWT implementation (in production, use proper JWT library)
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = btoa(`${encodedHeader}.${encodedPayload}.secret`);
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export const handler: Handler = async (event, context) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Content-Type": "application/json",
  };

  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: "",
    };
  }

  try {
    const path = event.path.replace("/.netlify/functions/api", "");
    const method = event.httpMethod;
    const body = event.body ? JSON.parse(event.body) : {};

    console.log(`🌐 [NETLIFY] ${method} ${path}`, { body });

    // Health check endpoint
    if (path === "/api/health" && method === "GET") {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          status: "ok",
          timestamp: new Date().toISOString(),
          environment: "production",
          message: "Netlify function is running",
        }),
      };
    }

    // Ping endpoint
    if (path === "/api/ping" && method === "GET") {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          message: process.env.PING_MESSAGE ?? "pong",
          timestamp: new Date().toISOString(),
          environment: "production",
        }),
      };
    }

    // Send OTP for farmer login
    if (path === "/api/auth/send-otp" && method === "POST") {
      const { email } = body;

      if (!email || !isValidEmail(email)) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({
            success: false,
            message: "Valid email is required",
          }),
        };
      }

      const otp = generateOTP();
      otpStore.set(email, {
        otp,
        timestamp: Date.now(),
      });

      console.log(`🔐 [OTP] Generated OTP for ${email}: ${otp}`);

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          message: "OTP sent successfully",
          // Only show OTP in strict local development
          ...(process.env.NODE_ENV === "development" &&
            process.env.DEBUG_AUTH === "true" && { otp }),
        }),
      };
    }

    // Verify OTP for farmer login
    if (path === "/api/auth/verify-otp" && method === "POST") {
      const { email, otp } = body;

      if (!email || !otp) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({
            success: false,
            message: "Email and OTP are required",
          }),
        };
      }

      const storedOTP = otpStore.get(email);
      if (!storedOTP) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({
            success: false,
            message: "OTP not found or expired",
          }),
        };
      }

      // Check if OTP is expired (5 minutes)
      const isExpired = Date.now() - storedOTP.timestamp > 5 * 60 * 1000;
      if (isExpired) {
        otpStore.delete(email);
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({
            success: false,
            message: "OTP has expired",
          }),
        };
      }

      if (storedOTP.otp !== otp) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({
            success: false,
            message: "Invalid OTP",
          }),
        };
      }

      // OTP verified successfully
      otpStore.delete(email);

      const token = generateJWT({
        email,
        role: "farmer",
        timestamp: Date.now(),
      });

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          message: "Login successful",
          user: {
            email,
            role: "farmer",
            name: "Farmer User",
          },
          token,
        }),
      };
    }

    // Admin login
    if (path === "/api/auth/admin-login" && method === "POST") {
      const { email, password } = body;

      if (!email || !password) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({
            success: false,
            message: "Email and password are required",
          }),
        };
      }

      // Validate admin credentials are configured
      if (!DEFAULT_ADMIN.email || !DEFAULT_ADMIN.password) {
        console.error(
          `❌ [AUTH] Admin credentials not configured in environment variables`,
        );
        return {
          statusCode: 500,
          headers: corsHeaders,
          body: JSON.stringify({
            success: false,
            message: "Admin authentication not configured",
          }),
        };
      }

      // Check admin credentials
      if (
        email !== DEFAULT_ADMIN.email ||
        password !== DEFAULT_ADMIN.password
      ) {
        console.log(`❌ [AUTH] Invalid admin login attempt: ${email}`);
        return {
          statusCode: 401,
          headers: corsHeaders,
          body: JSON.stringify({
            success: false,
            message: "Invalid credentials",
          }),
        };
      }

      const token = generateJWT({
        email,
        role: "admin",
        timestamp: Date.now(),
      });

      console.log(`✅ [AUTH] Admin login successful: ${email}`);

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          message: "Admin login successful",
          user: {
            email,
            role: "admin",
            name: "Admin User",
          },
          token,
        }),
      };
    }

    // Token verification
    if (path === "/api/auth/verify" && method === "GET") {
      const authHeader = event.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return {
          statusCode: 401,
          headers: corsHeaders,
          body: JSON.stringify({
            success: false,
            message: "No token provided",
          }),
        };
      }

      const token = authHeader.substring(7);

      try {
        // Simple token validation (in production, use proper JWT verification)
        const parts = token.split(".");
        if (parts.length !== 3) {
          throw new Error("Invalid token format");
        }

        const payload = JSON.parse(atob(parts[1]));

        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({
            success: true,
            user: {
              email: payload.email,
              role: payload.role,
              name: payload.role === "admin" ? "Admin User" : "Farmer User",
            },
          }),
        };
      } catch (error) {
        return {
          statusCode: 401,
          headers: corsHeaders,
          body: JSON.stringify({
            success: false,
            message: "Invalid token",
          }),
        };
      }
    }

    // Default 404 response
    return {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        message: `API endpoint not found: ${method} ${path}`,
        timestamp: new Date().toISOString(),
        availableEndpoints: [
          "GET /api/ping",
          "GET /api/health",
          "POST /api/auth/send-otp",
          "POST /api/auth/verify-otp",
          "POST /api/auth/admin-login",
          "GET /api/auth/verify",
        ],
      }),
    };
  } catch (error) {
    console.error("🚨 [NETLIFY ERROR]", error);

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV !== "production" ? error.message : undefined,
        timestamp: new Date().toISOString(),
      }),
    };
  }
};
