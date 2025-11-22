import { Response, NextFunction } from "express";
import { authMiddleware } from "./authMiddleware.ts";
import User from "../models/User.js";

export const adminMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  const user = await User.findById(req.user.userId);
  if (!user || !user.isAdmin) {
    return res.status(403).json({ error: "Forbidden, admin only" });
  }
  next();
};
