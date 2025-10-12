const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ 
      message: 'File too large. Maximum size is 50MB.' 
    });
  }

  if (err.message === 'File type not allowed') {
    return res.status(400).json({ 
      message: 'File type not allowed. Please upload PDF, DOCX, PPT, or image files.' 
    });
  }

  // MongoDB errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ 
      message: 'Validation failed', 
      errors 
    }); 
  }

  if (err.code === 11000) {
    return res.status(400).json({ 
      message: 'Email already exists' 
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ 
      message: 'Invalid token' 
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ 
      message: 'Token expired' 
    });
  }

  // Default error
  res.status(500).json({ 
    message: 'Internal server error' 
  });
};

module.exports = errorHandler; 