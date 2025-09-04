#!/usr/bin/env node

import "dotenv/config";

console.log("🔍 Verifying .env configuration...\n");

// Required environment variables
const requiredVars = [
  "MONGODB_URI",
  "DB_NAME",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
  "JWT_SECRET",
  "SENDGRID_API_KEY",
  "SENDGRID_FROM_EMAIL",
  "CLIENT_URL",
];

// Optional but recommended variables
const recommendedVars = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_REDIRECT_URI",
];

// Check required variables
console.log("📋 REQUIRED VARIABLES:");
let allRequiredPresent = true;

requiredVars.forEach((varName) => {
  const value = process.env[varName];
  if (value && value !== "") {
    if (
      varName.includes("SECRET") ||
      varName.includes("PASSWORD") ||
      varName.includes("KEY")
    ) {
      console.log(`   ✅ ${varName}: Set (hidden for security)`);
    } else if (varName === "MONGODB_URI" && value.includes("@")) {
      // Mask MongoDB URI for security
      const maskedUri = value.replace(/:[^@]+@/, ":***@");
      console.log(`   ✅ ${varName}: ${maskedUri}`);
    } else {
      console.log(`   ✅ ${varName}: ${value}`);
    }
  } else {
    console.log(`   ❌ ${varName}: Missing`);
    allRequiredPresent = false;
  }
});

// Check recommended variables
console.log("\n📋 RECOMMENDED VARIABLES:");
recommendedVars.forEach((varName) => {
  const value = process.env[varName];
  if (value && value !== "") {
    if (varName.includes("SECRET")) {
      console.log(`   ✅ ${varName}: Set (hidden for security)`);
    } else {
      console.log(`   ✅ ${varName}: ${value}`);
    }
  } else {
    console.log(`   ⚠️  ${varName}: Not set (optional)`);
  }
});

// Check for default/placeholder values that should be changed
console.log("\n🔍 CHECKING FOR DEFAULT VALUES:");
const defaultChecks = [
  { var: "JWT_SECRET", badValues: ["change-this-in-production", ""] },
  { var: "MONGODB_URI", badValues: ["mongodb+srv://user:pass@", ""] },
  { var: "SENDGRID_API_KEY", badValues: ["SG.your-api-key", ""] },
  { var: "ADMIN_PASSWORD", badValues: ["", "weak", "default"] },
];

defaultChecks.forEach((check) => {
  const value = process.env[check.var];
  if (value && check.badValues.some((bad) => value.includes(bad))) {
    console.log(
      `   ⚠️  ${check.var}: Using default value - should be changed!`,
    );
  }
});

// Summary
console.log("\n📊 SUMMARY:");
if (allRequiredPresent) {
  console.log("✅ All required environment variables are present");
  console.log("💡 You can test the setup with: pnpm run setup");
} else {
  console.log("❌ Missing required environment variables");
  console.log("💡 Please check the .env file and add missing variables");
}

// Test MongoDB connection if all required vars are present
if (allRequiredPresent && process.env.MONGODB_URI) {
  console.log("\n🧪 Testing MongoDB connection...");
  try {
    const { MongoClient } = await import("mongodb");
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    await client.db(process.env.DB_NAME).admin().ping();
    console.log("✅ MongoDB connection successful");
    await client.close();
  } catch (error) {
    console.log("❌ MongoDB connection failed:", error.message);
  }
}

console.log(
  '\n💡 TIP: Run "pnpm run setup" to initialize the database with your current configuration',
);
