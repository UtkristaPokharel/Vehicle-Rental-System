const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies.authToken;

  if (!token) {
    console.error('No token provided');
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.userId) {
      console.error('Token missing userId:', decoded);
      return res.status(401).json({ message: 'Invalid token: Missing user ID' });
    }
    req.user = { id: decoded.userId }; // Map userId to req.user.id
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;