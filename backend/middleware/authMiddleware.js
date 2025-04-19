// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: { message: 'Authentication invalid' } });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // Debug log
    console.log('JWT_SECRET available:', !!process.env.JWT_SECRET);
    
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    console.error('JWT verification failed:', error);
    return res.status(401).json({ error: { message: 'Authentication invalid' } });
  }
};

module.exports = { authenticateUser };