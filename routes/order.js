import express from "express";
import {
  createOrder,
  trackOrder,
} from "../controllers/orderController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/", authMiddleware, createOrder);
router.get("/:id/track", authMiddleware, trackOrder);

export default router;
