// server.js
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const path = require('path');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const authRoutes = require('./routes/authRoutes');
const committeeRoutes = require('./routes/committeRoutes');
const tenderRoutes = require('./routes/tenderRoutes');
const procurementPlanRoutes = require('./routes/procumentPlanRoutes');
const connectDB = require('./config/db'); 

// Create Express app
const app = express();

// 1) GLOBAL MIDDLEWARES
app.set('trust proxy', 1);

// Implement CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.options('*', cors());

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiter
const limiter = rateLimit({
  max: process.env.RATE_LIMIT_MAX || 100,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 2) ROUTES
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/committees', committeeRoutes);
app.use('/api/v1/tenders', tenderRoutes);
app.use('/api/v1/procurement-plans', procurementPlanRoutes);

// Test route
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is healthy'
  });
});

// 3) ERROR HANDLING
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Handle payload too large errors
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      status: 'error',
      message: 'Request entity too large. Please upload smaller files or reduce the number of files (max 5 files, 5MB each).'
    });
  }
  next(err);
});

app.use(globalErrorHandler);

// 4) START SERVER
const port = process.env.PORT || 5000;

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB(); // Call connectDB from db.js
    const server = app.listen(port, () => {
      console.log(`App running on port ${port}...`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.log('UNHANDLED REJECTION! 💥 Shutting down...');
      console.log(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
      console.log(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();