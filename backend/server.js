require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');


// Check for required environment variables 
if (!process.env.JWT_SECRET) {
  console.error('ERROR: JWT_SECRET is not defined in environment variables');
  process.exit(1);
}

// Initialize express app
const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(cors());



// Routes
app.use('/api/auth', authRoutes);


// Root route
app.get('/', (req, res) => {
  res.send('JWT Auth API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.statusCode || 500).json({
    error: {
      message: err.message || 'Something went wrong on the server'
    }
  });
});

// Not found middleware
app.use((req, res) => {
  res.status(404).json({ error: { message: 'Route not found' } });
});

// Connect to database and start server
const start = async () => {
  try {
    await connectDB();
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

start();
