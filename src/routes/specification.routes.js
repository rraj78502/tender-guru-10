
const express = require('express');
const router = express.Router();
const specificationController = require('../controllers/specification.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');
const multer = require('multer');
const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads/specifications'));
  },
  filename: function(req, file, cb) {
    cb(null, `spec-${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
  fileFilter: function(req, file, cb) {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
    }
  }
});

// Specification document routes
router.post('/', protect, specificationController.createSpecification);
router.get('/', protect, specificationController.getAllSpecifications);
router.get('/:id', protect, specificationController.getSpecificationById);
router.put('/:id', protect, specificationController.updateSpecification);
router.delete('/:id', protect, restrictTo('admin'), specificationController.deleteSpecification);

// Version history routes
router.get('/:id/versions', protect, specificationController.getVersionHistory);
router.post('/:id/versions', protect, upload.single('document'), specificationController.addNewVersion);

// Review routes
router.get('/reviews', protect, specificationController.getAllReviews);
router.get('/reviews/:reviewId', protect, specificationController.getReviewById);
router.post('/:id/reviews', protect, specificationController.scheduleReview);
router.put('/reviews/:reviewId', protect, specificationController.updateReview);

// Review documents routes
router.post('/reviews/documents', protect, upload.single('file'), specificationController.uploadReviewDocument);
router.get('/reviews/:reviewId/documents', protect, specificationController.getReviewDocuments);

// Review minutes routes
router.post('/reviews/:reviewId/minutes', protect, specificationController.addReviewMinutes);

module.exports = router;
