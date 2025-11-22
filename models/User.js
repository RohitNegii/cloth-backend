import mongoose, { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    phoneNumber: { type: String, required: true, unique: true },
    isVerified: { type: Boolean, default: false },
    name: { type: String },
    email: { type: String, lowercase: true },
    address: { type: String },
    isAdmin:{type:Boolean,default:false}
  },
  { timestamps: true }
);

const User = model(
  "User",
  UserSchema
);

export default User;
