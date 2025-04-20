require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const coverUploadRoutes = require('./routes/coverUpload');
const resumeUploadRoutes = require('./routes/resumeUpload'); // ✅ NEW

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

// Serve static cover pages
app.use('/coverPages', express.static('uploads/coverPages')); // Optional if you store locally
// Serve static resumes
app.use('/resumes', express.static('uploads/resumes')); // Optional if you store locally

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cover', coverUploadRoutes);
app.use('/api/resume', resumeUploadRoutes); // ✅ NEW

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
