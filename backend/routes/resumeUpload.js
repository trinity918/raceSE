const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const User = require('../models/User');
require('dotenv').config(); // ✅ Load environment variables

// ✅ Mongo URI
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/raceDB';

// ✅ Create GridFS storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return {
      filename: `${Date.now()}-${file.originalname}`,
      bucketName: 'resumes' // will create: resumes.files and resumes.chunks
    };
  }
});

// ✅ Multer middleware
const upload = multer({ storage });

// ✅ Upload route
router.post('/:userId', upload.single('resume'), async (req, res) => {
  try {
    const userId = req.params.userId;
    const fileId = req.file.id;

    // Update user document with resume file reference
    const user = await User.findByIdAndUpdate(
      userId,
      { resume: fileId },
      { new: true }
    );

    res.status(200).json({ msg: 'Resume uploaded successfully', fileId });
  } catch (error) {
    console.error('Resume Upload Error:', error);
    res.status(500).json({ msg: 'Error uploading resume', error: error.message });
  }
});

module.exports = router;
