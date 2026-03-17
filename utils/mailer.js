const nodemailer = require('nodemailer');

const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL;

// ✅ Create transporter safely
function getMailTransporter() {
  try {
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        },
        connectionTimeout: 5000 // prevents hanging
      });
    }
  } catch (err) {
    console.error("Mailer config error:", err.message);
  }

  return null;
}

// ✅ From address fallback
function getFromAddress() {
  return process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@hoteloasis.com";
}

// ✅ SAFE EMAIL SENDER (NEVER CRASHES)
async function sendMailSafe(options) {
  try {
    const transporter = getMailTransporter();

    if (!transporter) {
      console.log("⚠️ Email skipped: No SMTP config");
      return { success: false };
    }

    const info = await transporter.sendMail(options);

    console.log("✅ Email sent:", info.response);
    return { success: true };

  } catch (error) {
    console.error("❌ Email failed:", error.message);

    // NEVER throw → app continues
    return { success: false };
  }
}

module.exports = {
  getMailTransporter,
  getFromAddress,
  NOTIFICATION_EMAIL,
  sendMailSafe
};