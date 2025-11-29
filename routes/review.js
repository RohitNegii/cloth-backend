import express from "express";
import {
  addReview,
  getReviewsByProduct,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get all reviews for a product (public)
router.get("/product/:productId", getReviewsByProduct);

// Authenticated routes for managing reviews
router.use(authMiddleware);

router.post("/add", addReview);
router.put("/update/:id", updateReview);
router.delete("/delete/:id", deleteReview);

export default router;
