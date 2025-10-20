// server.js
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config'); // Assuming config.js is in backend/config.js
const errorHandler = require('./middleware/errorMiddleware'); // Import your error handler

const app = express();

// Middleware
app.use(cors({
  origin: [
    'https://eduneed-wyea.vercel.app',
    'https://eduneed-zeul-4svyq3x8r-mulukuri-sreerams-projects.vercel.app',
    'http://localhost:3000',
    'http://localhost:5000'
  ],
  credentials: true
}));
app.use(express.json());

// Database Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true, // Deprecated in Mongoose 6.0+
      // useFindAndModify: false // Deprecated in Mongoose 6.0+
    });

    // Get connection details
    const connUrl = conn.connection.client.s.url;
    const host = connUrl.includes('mongodb+srv') ? 'MongoDB Atlas' : 'Local MongoDB';
    const dbName = conn.connection.name;
    console.log(`Connected to ${host} | Database: ${dbName}`);
    console.log(`Full connection URL: ${connUrl}`);
    const name = conn.connection.name || 'unknown-db';
    console.log(`MongoDB Connected -> host: ${host}, database: ${name}`);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    // Exit process with failure
    process.exit(1);
  }
};

// Connect to the database
connectDB();

// Define your routes here (example)
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/files', require('./routes/files'));
app.use('/api/admin', require('./routes/admin'));

// Error handling middleware (should be the last middleware)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
