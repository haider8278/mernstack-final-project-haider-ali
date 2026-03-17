require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api', require('./routes/enrollmentRoutes'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'LMS API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler: consistent JSON errors (400, 401, 403, 404, 500)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || (err.name === 'ValidationError' ? 400 : err.name === 'CastError' ? 404 : 500);
  const message = err.message || (statusCode === 500 ? 'Internal Server Error' : 'Bad Request');
  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === 'development' && statusCode === 500 && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
