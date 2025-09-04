#!/usr/bin/env node

import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";
import "dotenv/config";

async function setupDatabase() {
  console.log("🚀 Setting up Carbon Roots MRV Database...\n");

  // Check environment variables
  const requiredEnvVars = [
    "MONGODB_URI",
    "DB_NAME",
    "ADMIN_EMAIL",
    "ADMIN_PASSWORD",
  ];
  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName],
  );

  if (missingVars.length > 0) {
    console.error("❌ Missing required environment variables:");
    missingVars.forEach((varName) => console.error(`   - ${varName}`));
    console.log("\n💡 Please set these in your .env file");
    process.exit(1);
  }

  const {
    MONGODB_URI,
    DB_NAME,
    ADMIN_EMAIL,
    ADMIN_PASSWORD,
    JWT_SECRET = "default-jwt-secret",
  } = process.env;

  console.log("📊 Configuration:");
  console.log(`   - Database: ${DB_NAME}`);
  console.log(`   - Admin Email: ${ADMIN_EMAIL}`);
  console.log(`   - JWT Secret: ${JWT_SECRET ? "✅ Set" : "❌ Not set"}`);
  console.log("");

  try {
    // Connect to MongoDB
    console.log("🔗 Connecting to MongoDB...");
    const client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db(DB_NAME);
    console.log("✅ Connected to MongoDB successfully");

    // Create collections if they don't exist
    const collections = ["farmers", "admins", "otps", "sessions", "passwords"];

    for (const collectionName of collections) {
      const collectionExists = await db
        .listCollections({ name: collectionName })
        .hasNext();
      if (!collectionExists) {
        await db.createCollection(collectionName);
        console.log(`📁 Created collection: ${collectionName}`);
      }
    }

    // Create indexes
    console.log("📊 Creating database indexes...");

    // Farmers collection indexes
    await db.collection("farmers").createIndex({ email: 1 }, { unique: true });
    await db.collection("farmers").createIndex({ phone: 1 });
    await db.collection("farmers").createIndex({ "location.pincode": 1 });

    // Admins collection indexes
    await db.collection("admins").createIndex({ email: 1 }, { unique: true });

    // OTPs collection indexes
    await db.collection("otps").createIndex({ email: 1 });
    await db
      .collection("otps")
      .createIndex({ expires: 1 }, { expireAfterSeconds: 0 });

    // Sessions collection indexes
    await db.collection("sessions").createIndex({ token: 1 }, { unique: true });
    await db.collection("sessions").createIndex({ userId: 1 });
    await db
      .collection("sessions")
      .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

    // Passwords collection indexes
    await db
      .collection("passwords")
      .createIndex({ userId: 1, userType: 1 }, { unique: true });

    console.log("✅ Database indexes created successfully");

    // Create default admin user
    console.log("\n👨‍💼 Creating default admin user...");

    const adminsCollection = db.collection("admins");
    const passwordsCollection = db.collection("passwords");

    // Check if admin already exists
    const existingAdmin = await adminsCollection.findOne({
      email: ADMIN_EMAIL,
    });

    if (existingAdmin) {
      console.log("ℹ️  Admin user already exists, updating password...");

      // Update admin password
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
      await passwordsCollection.updateOne(
        { userId: existingAdmin._id.toString(), userType: "admin" },
        {
          $set: {
            hashedPassword,
            updatedAt: new Date(),
          },
        },
        { upsert: true },
      );

      console.log("✅ Admin password updated successfully");
    } else {
      // Create new admin
      const adminData = {
        email: ADMIN_EMAIL,
        name: "System Administrator",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const adminResult = await adminsCollection.insertOne(adminData);
      const adminId = adminResult.insertedId.toString();

      // Hash and store password
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
      await passwordsCollection.insertOne({
        userId: adminId,
        userType: "admin",
        hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log("✅ Default admin user created successfully");
      console.log(`   - Email: ${ADMIN_EMAIL}`);
      console.log(`   - Password: ${ADMIN_PASSWORD}`);
    }

    // Test database operations
    console.log("\n🧪 Testing database operations...");

    // Test farmers collection
    const farmersCount = await db.collection("farmers").countDocuments();
    console.log(`   - Farmers in database: ${farmersCount}`);

    // Test admins collection
    const adminsCount = await db.collection("admins").countDocuments();
    console.log(`   - Admins in database: ${adminsCount}`);

    // Test connection health
    await db.admin().ping();
    console.log("✅ Database health check passed");

    console.log("\n🎉 Database setup completed successfully!");
    console.log("\n📋 Next steps:");
    console.log("   1. Start the server: pnpm run dev");
    console.log("   2. Visit: http://localhost:8080");
    console.log("   3. Login to admin dashboard with the credentials above");
    console.log("   4. Test farmer registration and authentication");
  } catch (error) {
    console.error("❌ Database setup failed:");
    console.error(error.message);

    if (error.code === "ENOTFOUND") {
      console.log(
        "\n💡 Check your MongoDB connection string and network connectivity",
      );
    } else if (error.code === 13) {
      console.log("\n💡 Check your MongoDB authentication credentials");
    } else if (error.code === 18) {
      console.log("\n💡 Check your MongoDB connection string format");
    }

    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run setup if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase().catch(console.error);
}

export { setupDatabase };
