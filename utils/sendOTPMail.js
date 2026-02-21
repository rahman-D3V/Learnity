import { transporter } from "../config/nodeMailer.js";

export const sendOTPMail = async (email,otp) => {
  try {
    await transporter.sendMail({
      from: "Learnity",
      to: "randomUser@gmail.com",
      subject: "Nodemailer Test",
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
  <h2 style="color: #333;">Password Changed Successfully 🔒</h2>

  <p style="font-size: 16px; color: #555;">
    This is a confirmation that your account password was changed successfully.
  </p>

  <p style="font-size: 16px; color: #555;">
    If you made this change, no further action is required.
  </p>

  <div style="margin: 30px 0;">
    <p style="font-size: 16px; color: #d32f2f; font-weight: bold;">
      Didn’t change your password?
    </p>

    <p style="font-size: 15px; color: #555;">
      Please reset your password immediately or contact our support team to secure your account.
    </p>
  </div>

  <p style="font-size: 14px; color: #777;">
    For your security, we recommend choosing a strong and unique password.
  </p>

  <hr style="margin: 30px 0;" />

  <p style="font-size: 12px; color: #999;">
    © 2026 Any Company. All rights reserved.
  </p>
</div>
`,
    });

    console.log("✅ Test email sent successfully");
  } catch (error) {
    console.error("❌ Email failed:", error.message);
  }
};

sendOTPMail();
