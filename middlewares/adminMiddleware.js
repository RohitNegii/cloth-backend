import User from '../models/User.js';

export const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Error verifying admin role', error });
  }
};
