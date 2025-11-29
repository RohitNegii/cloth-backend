import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    images: [{ type: String }],
    videoUrl: { type: String }, // New field added here, optional
    stock: { type: Number, default: 0 },
    sizes: [{ type: String }],
    colors: [{ type: String }],
    averageRating: {
      type: Number,  
      default: 0,
      min: 0,
      max: 5,
      set: (v) => Math.round(v * 10) / 10, // Store rating rounded to 1 decimal place
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);
