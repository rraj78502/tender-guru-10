
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const committeeRoutes = require('./routes/committee.routes');
const specificationRoutes = require('./routes/specification.routes');
// const procurementRoutes = require('./routes/procurement.routes');
// const vendorRoutes = require('./routes/vendor.routes');
// const tenderRoutes = require('./routes/tender.routes');
// const employeeRoutes = require('./routes/employee.routes');
// const evaluationRoutes = require('./routes/evaluation.routes');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for document uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/committees', committeeRoutes);
app.use('/api/specifications', specificationRoutes);
// app.use('/api/procurements', procurementRoutes);
// app.use('/api/vendors', vendorRoutes);
// app.use('/api/tenders', tenderRoutes);
// app.use('/api/employees', employeeRoutes);
// app.use('/api/evaluations', evaluationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadDir = path.join(__dirname, '../uploads/specifications');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
