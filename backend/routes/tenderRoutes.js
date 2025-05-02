const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const permissionMiddleware = require('../middleware/permisssionMiddleware');
const { uploadTenderDocuments } = require('../config/multer');
const tenderController = require('../controllers/tenderController');

// Protect all tender routes
router.use(authController.protect);

// GET /api/tenders/generate-ifb - Generate IFB number
router.get(
  '/generate-ifb',
  permissionMiddleware.checkAnyPermission(['manage-tenders']),
  tenderController.generateIFBNumber
);

// GET /api/tenders/createtender - Get all tenders
router.get(
  '/getalltenders',
  permissionMiddleware.checkAnyPermission(['manage-tenders']),
  tenderController.getAllTenders
);

// POST /api/tenders/createtender - Create new tender
router.post(
  '/createtender',
  permissionMiddleware.checkAnyPermission(['manage-tenders']),
  (req, res, next) => {
    req.body.uploadType = 'tender';
    next();
  },
  uploadTenderDocuments,
  tenderController.createTender
);

// GET /api/tenders/updatetender/:id - Get single tender
router.get(
  '/gettenderbyid/:id',
  permissionMiddleware.checkAnyPermission(['manage-tenders']),
  tenderController.getTender
);

// PATCH /api/tenders/updatetender/:id - Update a tender
router.patch(
  '/updatetender/:id',
  permissionMiddleware.checkAnyPermission(['manage-tenders']),
  (req, res, next) => {
    req.body.uploadType = 'tender';
    next();
  },
  uploadTenderDocuments,
  tenderController.updateTender
);

// DELETE /api/tenders/updatetender/:id - Delete a tender
router.delete(
  '/deletetender/:id',
  permissionMiddleware.checkAnyPermission(['manage-tenders']),
  tenderController.deleteTender
);

// POST /api/tenders/:id/comments - Add tender comment
router.post(
  '/:id/comments',
  permissionMiddleware.checkAnyPermission(['manage-tenders']),
  tenderController.addTenderComment
);

// GET /api/tenders/:id/download/:documentId - Download tender document
router.get(
  '/:id/download/:documentId',
  tenderController.downloadTenderDocument
);

module.exports = router;