import User from "../models/User.js";

export const adminMiddleware = async (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  const user = await User.findById(req.user.userId);
  if (!user || !user.isAdmin) {
    return res.status(403).json({ error: "Forbidden, admin only" });
  }
  next();
};
