import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Brevo (formerly Sendinblue) SMTP Transporter
export function createMailTransporter() {
  const host = process.env.BREVO_SMTP_HOST || "smtp-relay.brevo.com";
  const port = parseInt(process.env.BREVO_SMTP_PORT || "587", 10);
  const user = process.env.BREVO_SMTP_USER || "";
  const pass = process.env.BREVO_SMTP_PASS || "";

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for 587
    auth: {
      user,
      pass,
    },
  });
}

export async function sendOtpEmail(toEmail: string, otp: string, userName?: string): Promise<boolean> {
  const fromEmail = process.env.BREVO_FROM_EMAIL || "no-reply@mppolice.gov.in";
  const fromName = process.env.BREVO_FROM_NAME || "MP Police Dial 112 Portal";

  const transporter = createMailTransporter();

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Password Reset OTP - MP Police Portal</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0b1528; margin: 0; padding: 20px; color: #f1f5f9; }
    .container { max-width: 540px; margin: 0 auto; background-color: #111e38; border: 1px solid #1e3a8a; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    .header { background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%); padding: 30px 20px; text-align: center; border-bottom: 2px solid #f59e0b; }
    .badge { display: inline-block; background-color: rgba(245, 158, 11, 0.15); border: 1px solid #f59e0b; color: #fbbf24; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
    .title { color: #ffffff; font-size: 22px; font-weight: 700; margin: 0; }
    .content { padding: 32px 24px; line-height: 1.6; }
    .otp-box { background: #0b1528; border: 2px dashed #f59e0b; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
    .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #38bdf8; text-shadow: 0 0 10px rgba(56, 189, 248, 0.4); }
    .warning { background-color: rgba(239, 68, 68, 0.1); border-left: 4px solid #ef4444; padding: 12px 16px; border-radius: 4px; font-size: 13px; color: #fca5a5; margin-top: 24px; }
    .footer { background-color: #080f1d; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #1e293b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">Official Security Communication</div>
      <h1 class="title">TELANGANA / MP POLICE DIAL 112</h1>
      <p style="margin: 6px 0 0 0; color: #94a3b8; font-size: 13px;">Authorized Personnel Authentication System</p>
    </div>
    <div class="content">
      <p style="color: #e2e8f0; font-size: 15px; margin-top: 0;">
        Hello <strong>${userName || "Officer"}</strong>,
      </p>
      <p style="color: #94a3b8; font-size: 14px;">
        A request has been initiated to reset the password for your authorized administrator account (<code>${toEmail}</code>).
      </p>
      <div class="otp-box">
        <div style="color: #94a3b8; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 8px;">Your One-Time Password (OTP)</div>
        <div class="otp-code">${otp}</div>
        <div style="color: #64748b; font-size: 12px; margin-top: 8px;">Valid for 10 minutes only</div>
      </div>
      <p style="color: #94a3b8; font-size: 13px;">
        Please enter this verification code into the password reset screen to securely update your credentials.
      </p>
      <div class="warning">
        <strong>SECURITY NOTICE:</strong> If you did NOT request this verification code, please inform your department cyber cell immediately and ensure your account credentials remain confidential.
      </div>
    </div>
    <div class="footer">
      This is an automated security email from the Police Portal. Please do not reply directly to this message.<br>
      &copy; ${new Date().getFullYear()} Police Dial 112 ERSS. Confidential & Protected.
    </div>
  </div>
</body>
</html>
  `;

  // If user hasn't supplied real SMTP credentials yet, print to console so development works seamlessly
  if (!process.env.BREVO_SMTP_USER || !process.env.BREVO_SMTP_PASS) {
    console.log("==================================================================");
    console.log(`📧 [BREVO MAIL SIMULATION] (Set BREVO_SMTP_USER & PASS in .env for real delivery)`);
    console.log(`➡️ To: ${toEmail}`);
    console.log(`🔑 Reset OTP Code: [ ${otp} ]`);
    console.log(`⏱️ Expiry: 10 minutes`);
    console.log("==================================================================");
    return true;
  }

  try {
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: toEmail,
      subject: `[CONFIDENTIAL] Security Reset OTP: ${otp} - Police Dial 112`,
      text: `Your Police Portal password reset code is: ${otp}. This code is valid for 10 minutes.`,
      html: htmlContent,
    });
    console.log(`✅ Reset OTP sent via Brevo SMTP to ${toEmail}. Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send email via Brevo SMTP: ${(error as Error).message}`);
    // Output OTP in console so the developer can continue testing even if mail credentials failed
    console.log(`🔑 Fallback Console OTP for ${toEmail}: [ ${otp} ]`);
    return false;
  }
}
