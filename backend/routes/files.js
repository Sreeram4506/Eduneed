const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/authMiddleware');
const File = require('../models/File');
const config = require('../config');
const { validateFileUpload, handleValidationErrors } = require('../middleware/validationMiddleware');

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for allowed MIME types
const fileFilter = (req, file, cb) => {
  if (config.allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: config.fileUploadLimit },
  fileFilter
});

// POST /upload - upload a file
router.post('/upload', authMiddleware, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, validateFileUpload, handleValidationErrors, async (req, res) => {
  console.log('Upload request received');
  console.log('req.body:', req.body);
  console.log('req.file:', req.file);
  console.log('req.user:', req.user);
  const { title, subject, description } = req.body;
  if (!title || !subject) {
    console.log('Missing title or subject');
    return res.status(400).json({ message: 'Title and subject are required' });
  }
  if (!req.file) {
    console.log('No file uploaded');
    return res.status(400).json({ message: 'File is required' });
  }
  try {
    const file = new File({
      title,
      subject,
      description: description || '',
      filename: req.file.filename,
      fileType: req.file.mimetype,
      originalName: req.file.originalname,
      uploader: req.user._id
    });
    await file.save();
    console.log('File saved successfully');
    res.status(201).json({ message: 'File uploaded successfully', file });
  } catch (err) {
    console.log('Error saving file:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET / - list files with filters and search
router.get('/', async (req, res) => {
  const { subject, uploader, startDate, endDate, search } = req.query;
  const filter = {};
  if (subject) filter.subject = subject;
  if (uploader) filter.uploader = uploader;
  if (startDate || endDate) {
    filter.uploadDate = {};
    if (startDate) filter.uploadDate.$gte = new Date(startDate);
    if (endDate) filter.uploadDate.$lte = new Date(endDate);
  }
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  try {
    const files = await File.find(filter).populate('uploader', 'email').sort({ uploadDate: -1 });
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

// GET /:id/download - download file and increment download count
router.get('/:id/download', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    file.downloadCount += 1;
    await file.save();
    const filePath = path.join(__dirname, '..', 'uploads', file.filename);
    res.download(filePath, file.originalName);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /:id - get file details
router.get('/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id).populate('uploader', 'email');
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.json({
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
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
