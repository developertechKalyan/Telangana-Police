import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "../models/User.js";

dotenv.config();

async function seedAdmin() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mppolice";
  console.log("Connecting to MongoDB for Admin seed...");

  try {
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");

    const email = (process.env.ADMIN_EMAIL || "admin@mppolice.gov.in").toLowerCase().trim();
    const password = process.env.ADMIN_PASSWORD || "PoliceAdmin@2026!";
    const name = process.env.ADMIN_NAME || "Superintendent of Police (Admin)";
    const badgeNumber = process.env.ADMIN_BADGE || "MP-DIAL112-001";

    const existing = await User.findOne({ email });
    if (existing) {
      existing.password = password;
      existing.name = name;
      existing.badgeNumber = badgeNumber;
      existing.role = "superadmin";
      existing.isActive = true;
      await existing.save();
      console.log(`✅ Admin account updated: ${email}`);
    } else {
      await User.create({
        email,
        password,
        name,
        badgeNumber,
        role: "superadmin",
        isActive: true,
      });
      console.log(`✅ Authorized Admin account created: ${email}`);
    }

    console.log("==================================================");
    console.log("👮 POLICE PORTAL ADMIN CREDENTIALS");
    console.log(`📧 Email:    ${email}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`🛡️ Role:     superadmin`);
    console.log("==================================================");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed admin error:", error);
    process.exit(1);
  }
}

seedAdmin();
