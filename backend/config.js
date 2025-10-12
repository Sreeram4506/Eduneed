module.exports = {
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/student-file-sharing',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key',
  fileUploadLimit: 50 * 1024 * 1024, // 50MB
  allowedFileTypes: [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
    'application/vnd.ms-powerpoint', // PPT
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PPTX
    'image/jpeg', // JPG
    'image/png', //PNG
    'image/gif' //GIF gif means it is an animated image which can will be moved like an video but it is an image file
  ],
  email: {
    service: process.env.EMAIL_SERVICE || 'gmail',
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-email-password'
  }
};
