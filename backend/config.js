module.exports = {
  mongoURI: process.env.MONGO_URI || 'mongodb+srv://Sreeram:8977012479%40Sree@cluster0.z824tc0.mongodb.net/student-file-sharing?retryWrites=true&w=majority&appName=Cluster0',
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
