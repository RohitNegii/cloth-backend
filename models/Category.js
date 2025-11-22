import mongoose, { Schema } from "mongoose";

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    parentCategory: { type: Schema.Types.ObjectId, ref: "Category" },
  },
  { timestamps: true }
);

export default mongoose.model("Category", CategorySchema);
