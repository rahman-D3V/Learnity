import { transporter } from "../../config/nodeMailer.config.js";


export const sendCourseEnrollmentMail = async (email, userName, courseName) => {
  try {
    await transporter.sendMail({
      from: "Learnity <no-reply@learnity.com>",
      to: email,
      subject: "Course Enrollment Confirmation",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
        
        <h2 style="color: #333;">You're Enrolled 🎉</h2>

        <p style="font-size: 16px; color: #555;">
          Hi ${userName},
        </p>

        <p style="font-size: 16px; color: #555;">
          Congratulations! You have successfully enrolled in the course:
        </p>

        <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 8px;">
          <p style="font-size: 18px; font-weight: bold; margin: 0;">
            ${courseName}
          </p>
        </div>

        <p style="font-size: 16px; color: #555;">
          You can now start learning right away from your dashboard.
        </p>

        <p style="font-size: 14px; color: #777;">
          If you have any questions, feel free to contact our support team.
        </p>

        <hr style="margin: 30px 0;" />

        <p style="font-size: 12px; color: #999;">
          © 2026 Learnity. All rights reserved.
        </p>

      </div>
      `,
    });

    console.log("Course enrollment email sent successfully");
  } catch (error) {
    console.error("Email failed:", error.message);
  }
};