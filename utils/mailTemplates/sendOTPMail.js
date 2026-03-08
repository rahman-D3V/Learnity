import { transporter } from "../../config/nodeMailer.config.js";

export const sendOTPMail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: '"Learnity" <no-reply@learnity.com>',
      to: email,
      subject: "Verify your email - Learnity OTP",
      html: `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px; background:#ffffff; border:1px solid #e5e5e5; border-radius:8px;">
        
        <h2 style="color:#2c3e50; text-align:center;">
          Welcome to Learnity 🎓
        </h2>

        <p style="font-size:16px; color:#555;">
          Thanks for signing up! To complete your registration, please use the verification code below.
        </p>

        <div style="text-align:center; margin:30px 0;">
          <span style="font-size:28px; letter-spacing:6px; font-weight:bold; color:#1a73e8; background:#f4f6f8; padding:12px 20px; border-radius:6px;">
            ${otp}
          </span>
        </div>

        <p style="font-size:15px; color:#555;">
          This OTP is valid for <b>5 minutes</b>. Please do not share this code with anyone.
        </p>

        <p style="font-size:15px; color:#555;">
          If you did not create an account on Learnity, you can safely ignore this email.
        </p>

        <hr style="margin:30px 0; border:none; border-top:1px solid #eee;" />

        <p style="font-size:13px; color:#888; text-align:center;">
          © ${new Date().getFullYear()} Learnity. All rights reserved.
        </p>

      </div>
      `,
    });

    console.log("OTP email sent successfully");
  } catch (error) {
    console.error("Email failed:", error.message);
  }
};
