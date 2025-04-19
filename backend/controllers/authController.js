const User = require('../models/User');

const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        error: { message: 'Email already in use' }
      });
    }

    // Create new user
    const user = await User.create({ 
      name: username, 
      email, 
      password 
    });
    
    res.status(201).json({
      user: {
        username: user.name,
        email: user.email,
        id: user._id
      }
    });
  } catch (error) {
    res.status(500).json({
      error: { message: error.message || 'Server error' }
    });
  }
};

const login = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    if (!identifier || !password) {
      return res.status(400).json({ 
        error: { message: 'Please provide email and password' }
      });
    }

    // Find user by email
    const user = await User.findOne({ email: identifier });
    if (!user) {
      return res.status(401).json({ 
        error: { message: 'Invalid credentials' }
      });
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ 
        error: { message: 'Invalid credentials' }
      });
    }

    const token = user.createJWT();
    res.status(200).json({
      jwt: token,
      user: {
        username: user.name,
        email: user.email,
        id: user._id
      }
    });
  } catch (error) {
    res.status(500).json({
      error: { message: error.message || 'Server error' }
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    res.status(200).json({
      user: {
        username: req.user.name,
        id: req.user.userId,
        email: req.user.email
      }
    });
  } catch (error) {
    res.status(500).json({
      error: { message: error.message || 'Server error' }
    });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
};