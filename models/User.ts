import mongoose, { Document, Schema, Model, model } from "mongoose";

export interface IUser {
  phoneNumber: string;
  isVerified: boolean;
  name?: string;
  email?: string;
  address?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isAdmin?:Boolean;
}

// Extend Mongoose Document with IUser interface
export interface IUserDocument extends IUser, Document {}

const UserSchema: Schema<IUserDocument> = new Schema(
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

const User: Model<IUserDocument> = model<IUserDocument>(
  "User",
  UserSchema
);

export default User;
