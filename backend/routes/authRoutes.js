const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser } = require('../controllers/authController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.post('/local/register', register);
router.post('/local', login);
router.get('/me', authenticateUser, getCurrentUser);

// For testing purposes
router.get('/test', authenticateUser, (req, res) => {
  res.json({ msg: 'Authenticated route works', user: req.user });
});

module.exports = router;