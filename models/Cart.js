import mongoose, { Schema } from "mongoose";

const CartSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", unique: true },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, default: 1 },
        size: { type: String },
        color: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Cart", CartSchema);
