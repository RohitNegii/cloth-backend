import express from "express";
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authenticated user
router.use(authMiddleware);

// Get user cart
router.get("/", getCart);

// Add item to cart
router.post("/add", addItemToCart);

// Update item quantity or attributes in cart
router.put("/update/:itemId", updateCartItem);

// Remove item from cart
router.delete("/remove/:itemId", removeCartItem);

// Clear entire cart
router.delete("/clear", clearCart);

export default router;
