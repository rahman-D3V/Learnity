import express from "express";
import { isAuthenticated, isStudent } from "../middlewares/auth.middleware.js";
import {
  capturePayment,
  verifySignature,
} from "../controllers/Payment.controller.js";

const router = express.Router();

router.post("/capturePayment", isAuthenticated, isStudent, capturePayment);
router.post("/verifyPayment", isAuthenticated, isStudent, verifySignature);

// router.post("/sendPaymentSuccessEmail", isAuthenticated, isStudent, sendPaymentSuccessEmail); already sending course purchase confrimation mail

export default router;
