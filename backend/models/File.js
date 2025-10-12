const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    enum: ['Math', 'Physics', 'Chemistry', 'Biology', 'English', 'Other']
  },
  description: {
    type: String,
    default: ''
  },
  filename: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  downloadCount: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('File', FileSchema);
