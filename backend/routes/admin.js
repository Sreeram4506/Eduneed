const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const User = require('../models/User');
const File = require('../models/File');
const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const router = express.Router();

// Middleware to check admin role
const adminOnly = [authMiddleware, roleMiddleware(['admin'])];

// GET /users - list all users
router.get('/users', adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /files - list all files
router.get('/files', adminOnly, async (req, res) => {
  try {
    const files = await File.find().populate('uploader', 'email').sort({ uploadDate: -1 });
    const result = files.map(file => ({
      _id: file._id,
      title: file.title,
      subject: file.subject,
      description: file.description,
      fileName: file.filename,
      fileType: file.fileType,
      originalName: file.originalName,
      uploaderName: file.uploader?.email || '',
      uploadDate: file.uploadDate,
      downloadCount: file.downloadCount
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /files/:id - delete a file
router.delete('/files/:id', adminOnly, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    // Delete file from uploads folder
    const filePath = path.join(__dirname, '..', 'uploads', file.filename);
    try {
      await fsPromises.unlink(filePath);
    } catch (err) {
      console.error('Error deleting file from disk:', err);
      // Continue to delete from DB even if file deletion fails
    }
    await file.deleteOne();
    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
