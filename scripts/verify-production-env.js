#!/usr/bin/env node

/**
 * Production Environment Verification Script
 * उपयोग: node scripts/verify-production-env.js
 */

const requiredEnvVars = [
  "NODE_ENV",
  "SENDGRID_API_KEY",
  "SENDGRID_FROM_EMAIL",
  "MONGODB_URI",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
  "JWT_SECRET",
];

const optionalEnvVars = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "CLIENT_URL",
  "DEBUG_AUTH",
];

console.log("🔍 Production Environment Verification\n");

let hasErrors = false;

// Check required environment variables
console.log("📋 Required Environment Variables:");
requiredEnvVars.forEach((varName) => {
  const value = process.env[varName];
  if (!value) {
    console.log(`❌ ${varName}: NOT SET`);
    hasErrors = true;
  } else if (value.includes("your-") || value.includes("placeholder")) {
    console.log(`⚠️  ${varName}: Contains placeholder value`);
    hasErrors = true;
  } else {
    // Mask sensitive values
    const maskedValue =
      varName.includes("SECRET") ||
      varName.includes("PASSWORD") ||
      varName.includes("API_KEY")
        ? "*".repeat(Math.min(value.length, 20))
        : value;
    console.log(`✅ ${varName}: ${maskedValue}`);
  }
});

console.log("\n📋 Optional Environment Variables:");
optionalEnvVars.forEach((varName) => {
  const value = process.env[varName];
  if (!value) {
    console.log(`⚪ ${varName}: Not set (optional)`);
  } else {
    const maskedValue =
      varName.includes("SECRET") ||
      varName.includes("PASSWORD") ||
      varName.includes("API_KEY")
        ? "*".repeat(Math.min(value.length, 20))
        : value;
    console.log(`✅ ${varName}: ${maskedValue}`);
  }
});

// Specific checks
console.log("\n🔧 Configuration Checks:");

// Check NODE_ENV
if (process.env.NODE_ENV === "production") {
  console.log("✅ NODE_ENV: Set to production");
} else {
  console.log(
    `⚠️  NODE_ENV: Set to "${process.env.NODE_ENV}" (should be "production" in live environment)`,
  );
}

// Check SendGrid API key format
if (process.env.SENDGRID_API_KEY) {
  if (process.env.SENDGRID_API_KEY.startsWith("SG.")) {
    console.log("✅ SENDGRID_API_KEY: Valid format");
  } else {
    console.log(
      '❌ SENDGRID_API_KEY: Invalid format (should start with "SG.")',
    );
    hasErrors = true;
  }
}

// Check MongoDB URI format
if (process.env.MONGODB_URI) {
  if (
    process.env.MONGODB_URI.startsWith("mongodb://") ||
    process.env.MONGODB_URI.startsWith("mongodb+srv://")
  ) {
    console.log("✅ MONGODB_URI: Valid format");
  } else {
    console.log("❌ MONGODB_URI: Invalid format");
    hasErrors = true;
  }
}

// Check email format
if (process.env.ADMIN_EMAIL) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(process.env.ADMIN_EMAIL)) {
    console.log("✅ ADMIN_EMAIL: Valid format");
  } else {
    console.log("❌ ADMIN_EMAIL: Invalid email format");
    hasErrors = true;
  }
}

if (process.env.SENDGRID_FROM_EMAIL) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(process.env.SENDGRID_FROM_EMAIL)) {
    console.log("✅ SENDGRID_FROM_EMAIL: Valid format");
  } else {
    console.log("❌ SENDGRID_FROM_EMAIL: Invalid email format");
    hasErrors = true;
  }
}

// Final result
console.log("\n🎯 Summary:");
if (hasErrors) {
  console.log("❌ Configuration has errors! Please fix the issues above.");
  console.log("\n📖 For setup instructions, see: NETLIFY_PRODUCTION_SETUP.md");
  process.exit(1);
} else {
  console.log("✅ All configuration looks good!");
  console.log("\n🚀 Your production environment is properly configured.");
}

console.log("\n💡 Testing Instructions:");
console.log("1. Visit your deployed app");
console.log("2. Try OTP login with a real email");
console.log("3. Check that emails are being sent via SendGrid");
console.log("4. Verify no test OTPs are displayed in production");
