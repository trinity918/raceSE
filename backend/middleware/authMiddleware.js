const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  // Check for token in headers
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: { message: 'Authentication invalid' }
    });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user info to request object
    req.user = { 
      userId: payload.userId, 
      name: payload.name,
      email: payload.email
    };
    next();
  } catch (error) {
    return res.status(401).json({ 
      error: { message: 'Authentication invalid' }
    });
  }
};

module.exports = {
  authenticateUser,
};