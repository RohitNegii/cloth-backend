import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.js"
import productRoutes from "./routes/product.js";
import cartRoutes from "./routes/cart.js";
import reviewRoutes from "./routes/review.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/reviews", reviewRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("Clothing E-commerce API is running!");
});

// MongoDB Connection and Server Start
mongoose
  .connect(process.env.DATABASE_URL!, {
    // options can be added if needed
  })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
