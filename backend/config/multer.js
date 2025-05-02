const multer = require('multer');
const path = require('path');
const winston = require('winston');

// Logger for Multer
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/multer.log' }),
    new winston.transports.Console()
  ]
});

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine upload path based on the route
    let uploadPath;
    if (req.originalUrl.includes('/createtender') || req.originalUrl.includes('/updatetender')) {
      uploadPath = path.join(__dirname, '../uploads/tenders');
    } else if (req.originalUrl.includes('/createcommittees') || req.originalUrl.includes('/updatecommittees')) {
      uploadPath = path.join(__dirname, '../uploads/committees');
    } else {
      logger.error('Unknown upload route:', req.originalUrl);
      return cb(new Error('Invalid upload route'));
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`; // Fixed: originalName -> originalname
    logger.info('File upload:', { filename, originalName: file.originalname });
    cb(null, filename);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const filetypes = /pdf|doc|docx/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // Fixed: originalName -> originalname

  if (mimetype && extname) {
    cb(null, true);
  } else {
    logger.warn('Invalid file type:', { filename: file.originalname, mimetype: file.mimetype });
    cb(new Error('Only PDF, DOC, and DOCX files are allowed!'));
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
    files: 10 // Max 10 files per request
  }
});

// Middleware for committee (single file)
const uploadCommitteeLetter = upload.single('formationLetter');

// Middleware for tender (multiple files)
const uploadTenderDocuments = upload.array('documents', 10);

module.exports = {
  upload,
  uploadCommitteeLetter,
  uploadTenderDocuments
};