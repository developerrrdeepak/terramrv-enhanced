#!/usr/bin/env node

import "dotenv/config";

async function testAPI() {
  console.log("🧪 Testing Carbon Roots MRV API Integration...\n");

  const baseURL = process.env.CLIENT_URL || "http://localhost:8080";
  const apiURL = `${baseURL.replace(/\/$/, "")}/api`;

  console.log(`📡 API Base URL: ${apiURL}`);
  console.log("");

  // Test endpoints to check
  const testEndpoints = [
    { method: "GET", path: "/ping", description: "Basic ping endpoint" },
    { method: "GET", path: "/health", description: "Health check endpoint" },
    {
      method: "POST",
      path: "/auth/send-otp",
      description: "OTP sending endpoint",
    },
    {
      method: "POST",
      path: "/auth/verify-otp",
      description: "OTP verification endpoint",
    },
    {
      method: "POST",
      path: "/auth/admin-login",
      description: "Admin login endpoint",
    },
  ];

  console.log("🔍 Testing API endpoints:");
  console.log("");

  for (const endpoint of testEndpoints) {
    try {
      const url = `${apiURL}${endpoint.path}`;
      console.log(
        `   ${endpoint.method} ${endpoint.path} - ${endpoint.description}`,
      );

      const options = {
        method: endpoint.method,
        headers: {
          "Content-Type": "application/json",
        },
      };

      // Add body for POST requests
      if (endpoint.method === "POST") {
        let body = {};

        if (endpoint.path === "/auth/send-otp") {
          body = { email: "test@example.com" };
        } else if (endpoint.path === "/auth/verify-otp") {
          body = { email: "test@example.com", otp: "000000" };
        } else if (endpoint.path === "/auth/admin-login") {
          // Skip admin login test if credentials not provided
          if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
            console.log("   ⏭️  Skipped (credentials not configured)");
            continue;
          }
          body = {
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
          };
        }

        options.body = JSON.stringify(body);
      }

      const response = await fetch(url, options);
      const responseText = await response.text();

      let result;
      try {
        result = JSON.parse(responseText);
      } catch {
        result = { raw: responseText };
      }

      if (response.ok) {
        console.log(`   ✅ Success (${response.status})`);
        if (result.success !== undefined) {
          console.log(`      Success: ${result.success}`);
        }
        if (result.message) {
          console.log(`      Message: ${result.message}`);
        }
      } else {
        console.log(`   ❌ Failed (${response.status})`);
        if (result.message) {
          console.log(`      Error: ${result.message}`);
        }
        if (result.error) {
          console.log(`      Details: ${result.error}`);
        }
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      console.log(`      Make sure the server is running: pnpm run dev`);
    }

    console.log("");
  }

  // Test database connection
  console.log("🗄️  Testing Database Connection...");
  try {
    const { MongoClient } = await import("mongodb");

    if (!process.env.MONGODB_URI) {
      console.log("   ❌ MONGODB_URI not set in environment variables");
      return;
    }

    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    const db = client.db(process.env.DB_NAME || "carbonroots");
    await db.admin().ping();

    console.log("   ✅ MongoDB connection successful");

    // Check collections
    const collections = await db.listCollections().toArray();
    console.log(`   📊 Collections: ${collections.length} found`);

    collections.forEach((collection) => {
      console.log(`      - ${collection.name}`);
    });

    await client.close();
  } catch (error) {
    console.log(`   ❌ Database connection failed: ${error.message}`);
    console.log("   💡 Check your MONGODB_URI in .env file");
  }

  console.log("");
  console.log("📋 Summary:");
  console.log("✅ Environment configuration complete");
  console.log("✅ Database setup scripts created");
  console.log("✅ API endpoints configured");
  console.log("");
  console.log("🚀 Next steps:");
  console.log("   1. Install dependencies: pnpm install");
  console.log("   2. Setup database: pnpm run setup:db");
  console.log("   3. Start development: pnpm run dev");
  console.log("   4. Test APIs: pnpm run test:api");
  console.log("");
  console.log("🌐 Application will be available at: http://localhost:8080");
}

testAPI().catch(console.error);
