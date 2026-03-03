import mongoose from "mongoose";
import { instance } from "../config/razorpay.config.js";
import { Course } from "../models/Course.js";
import { User } from "../models/User.js";
import { sendCourseEnrollmentMail } from "../utils/mailTemplates/sendCourseEnrollementMail.js";
import crypto from "crypto";

// Capture the payment and initate the razorpay order
const capturePayment = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required.",
      });
    }

    // Check if course exists
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    // Check if already purchased
    const alreadyEnrolled = course.studentsEnrolled.some((id) =>
      id.equals(userId),
    );

    if (alreadyEnrolled) {
      return res.status(409).json({
        success: false,
        message: "You have already purchased this course.",
      });
    }

    // Create Razorpay order
    const options = {
      amount: course.price * 100,
      currency: "INR",
      receipt: `receipt_${crypto.randomUUID()}`,
      notes: {
        courseId,
        userId,
      },
    };

    //   initate the payment using rajorpay
    const paymentResponse = await instance.orders.create(options);
    console.log(paymentResponse);

    return res.status(200).json({
      success: true,
      courseName: course.courseName,
      courseDescription: course.courseDescription,
      thumbnail: course.thumbnail,
      orderId: paymentResponse.id,
      currency: paymentResponse.currency,
      amount: paymentResponse.amount,
    });
  } catch (error) {
    console.error("Error while capturing payment:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to initiate payment.",
      error: error.message,
    });
  }
};

// Validate Razorpay webhook signature to ensure payment integrity, then update enrollment records
const verifySignature = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signatureFromRazorpay = req.headers["x-razorpay-signature"]; // Razorpay webhook secret used to verify the request signature

    const hmac = crypto.createHmac("sha256", webhookSecret);
    hmac.update(JSON.stringify(req.body)); //if got any error. Then pass raw body, NOT JSON.stringify
    const digest = hmac.digest("hex");

    if (signatureFromRazorpay == digest) {
      console.log("Payment is authorized");

      const { courseId, userId } = req.body.payload.payment.entity.notes;

      // insert studentID into course schema field:studentsEnrolled
      const enrolledCourse = await Course.findByIdAndUpdate(
        courseId,
        { $push: { studentsEnrolled: userId } },
        { new: true },
      );

      if (!enrolledCourse) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }
      console.log(enrolledCourse);

      // add user ID to the course's studentsEnrolled array
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        { $push: { courses: courseId } },
        { new: true },
      );
      console.log(enrolledStudent);

      // Send course enrollment confirmation email to the user
      await sendCourseEnrollmentMail(
        enrolledStudent.email,
        enrolledStudent.firstName,
        enrolledCourse.courseName,
      );
      console.log("Course send email send");

      return res.status(200).json({
        success: true,
        message: "Payment verified and course enrolled successfully",
      });
    } else {
      console.error("Error while verifying signature:", error);

      return res.status(500).json({
        success: false,
        message: "Invalid requrest",
      });
    }
  } catch (error) {
    console.error("Error while Signature verifed:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to verify payment.",
      error: error.message,
    });
  }
};

export { capturePayment, verifySignature };
