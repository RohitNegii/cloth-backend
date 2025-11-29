import express from "express";
import multer from "multer";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { createProduct, editProduct, getAllProducts, getProduct } from "../controllers/productController.js";

const router = express.Router();
const upload = multer();

router.get("/", getAllProducts);
router.get("/:id", getProduct);

// Admin protected routes
router.post(
  "/create",
  // authMiddleware,
  // adminMiddleware,
  upload.fields([{ name: "images" }, { name: "video", maxCount: 1 }]),
  createProduct
);

router.put(
  "/edit/:id",
  authMiddleware,
  adminMiddleware,
  upload.fields([{ name: "images" }, { name: "video", maxCount: 1 }]),
  editProduct
);

export default router;
