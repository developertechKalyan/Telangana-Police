import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "../models/User.js";
import { passwordProblem } from "../config/security.js";

dotenv.config();

/**
 * Creates the first admin account from ADMIN_* in .env.
 *
 *   npm run seed:admin                     create the admin if it doesn't exist (never touches an existing password)
 *   npm run seed:admin -- --reset-password also set an existing admin's password to ADMIN_PASSWORD
 *
 * The password is never printed. After the first login, clear ADMIN_PASSWORD from .env.
 */
async function seedAdmin() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mppolice";
  const resetPassword = process.argv.includes("--reset-password");

  const email = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || "";
  const name = process.env.ADMIN_NAME || "Dial 112 Administrator";
  const badgeNumber = process.env.ADMIN_BADGE || undefined;

  if (!email) {
    console.error("❌ ADMIN_EMAIL is not set in .env.");
    process.exit(1);
  }

  console.log("Connecting to MongoDB for admin seed...");

  try {
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");

    const existing = await User.findOne({ email });

    if (existing && !resetPassword) {
      existing.name = name;
      if (badgeNumber) existing.badgeNumber = badgeNumber;
      existing.role = "superadmin";
      existing.isActive = true;
      await existing.save();
      console.log(`✅ Admin account already exists: ${email} (password left unchanged; use --reset-password to change it)`);
    } else {
      const problem = passwordProblem(password);
      if (problem) {
        console.error(`❌ ADMIN_PASSWORD: ${problem}`);
        await mongoose.disconnect();
        process.exit(1);
      }

      if (existing) {
        existing.password = password;
        existing.name = name;
        if (badgeNumber) existing.badgeNumber = badgeNumber;
        existing.role = "superadmin";
        existing.isActive = true;
        await existing.save();
        console.log(`✅ Admin password reset for ${email}. Older login sessions are now signed out.`);
      } else {
        await User.create({ email, password, name, badgeNumber, role: "superadmin", isActive: true });
        console.log(`✅ Admin account created: ${email}`);
      }
      console.log("ℹ️  The password is the ADMIN_PASSWORD value in .env. Remove it from .env after logging in.");
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed admin error:", error);
    process.exit(1);
  }
}

seedAdmin();
