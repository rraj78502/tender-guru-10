const Tender = require('../models/tenderModel');
const User = require('../models/userModel');
const fs = require('fs');
const path = require('path');
const AppError = require('../utils/appError');
const nodemailer = require('nodemailer');
const validator = require('validator');
const winston = require('winston');
const multer = require('multer');

// Set up Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/tender.log' }),
    new winston.transports.Console()
  ]
});

// @desc    Generate IFB Number
// @route   GET /api/tenders/generate-ifb
const generateIFBNumber = async (req, res, next) => {
  try {
    const tendersCount = await Tender.countDocuments();
    const ifbNumber = `IFB-${new Date().getFullYear()}-${String(tendersCount + 1).padStart(4, '0')}`;

    res.status(200).json({
      status: 'success',
      data: { ifbNumber }
    });
  } catch (error) {
    next(new AppError('Failed to generate IFB number', 500));
  }
};

// @desc    Create a new tender
// @route   POST /api/tenders
const createTender = async (req, res, next) => {
  try {
    const { 
      ifbNumber, 
      title, 
      description, 
      publishDate, 
      openingDate, 
      bidValidity, 
      status, 
      approvalStatus, 
      shouldNotify 
    } = req.body;

    const tender = new Tender({
      ifbNumber,
      title,
      description,
      publishDate,
      openingDate,
      bidValidity,
      status,
      approvalStatus,
      createdBy: req.user._id,
      documents: req.files ? req.files.map(file => ({
        filename: file.filename,
        path: file.path,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size
      })) : [],
      comments: [] // Initialize comments array
    });

    await tender.save();

    const populatedTender = await Tender.findById(tender._id)
      .populate('createdBy', 'name email role employeeId');

    if (shouldNotify === 'true') {
      await sendTenderNotifications(populatedTender);
    }

    res.status(201).json({
      status: 'success',
      data: { tender: populatedTender }
    });
  } catch (error) {
    // Handle Multer errors
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        return next(new AppError('Unexpected field name. Use "documents" for file uploads.', 400));
      }
      if (error.code === 'LIMIT_FILE_SIZE') {
        return next(new AppError('File size exceeds 5MB limit.', 400));
      }
      if (error.code === 'LIMIT_FILE_COUNT') {
        return next(new AppError('Too many files uploaded. Maximum is 10.', 400));
      }
      return next(new AppError(`Multer error: ${error.message}`, 400));
    }

    // Clean up uploaded files on error
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path, err => {
          if (err) console.error('Error deleting uploaded file:', err);
        });
      });
    }
    next(error);
  }
};

// @desc    Get all tenders
// @route   GET /api/tenders
const getAllTenders = async (req, res, next) => {
  try {
    const tenders = await Tender.find()
      .sort('-createdAt')
      .populate('createdBy', 'name email role employeeId');

    res.status(200).json({
      status: 'success',
      results: tenders.length,
      data: { tenders }
    });
  } catch (error) {
    next(new AppError('Failed to fetch tenders', 500));
  }
};

// @desc    Get single tender
// @route   GET /api/tenders/:id
const getTender = async (req, res, next) => {
  try {
    const tender = await Tender.findById(req.params.id)
      .populate('createdBy', 'name email role employeeId');

    if (!tender) {
      return next(new AppError('Tender not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { tender }
    });
  } catch (error) {
    next(new AppError('Failed to fetch tender', 500));
  }
};

// @desc    Update a tender
// @route   PATCH /api/tenders/:id
const updateTender = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info('Update tender ID:', id);

    const tender = await Tender.findById(id).populate(
      'createdBy', 'name email role employeeId'
    );

    if (!tender) {
      return next(new AppError('No tender found with that ID', 404));
    }

    if (tender.createdBy._id.toString() !== req.user._id.toString()) {
      return next(new AppError('You are not authorized to update this tender', 403));
    }

    const allowedUpdates = {
      ifbNumber: req.body.ifbNumber,
      title: req.body.title,
      description: req.body.description,
      publishDate: req.body.publishDate,
      openingDate: req.body.openingDate,
      bidValidity: req.body.bidValidity,
      status: req.body.status,
      approvalStatus: req.body.approvalStatus,
      shouldNotify: req.body.shouldNotify
    };

    Object.keys(allowedUpdates).forEach(
      (key) => allowedUpdates[key] === undefined && delete allowedUpdates[key]
    );

    if (req.files && req.files.length > 0) {
      allowedUpdates.documents = [
        ...tender.documents,
        ...req.files.map(file => ({
          filename: file.filename,
          path: file.path,
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size
        }))
      ];
    }

    Object.assign(tender, allowedUpdates);
    await tender.save();

    const populatedTender = await Tender.findById(tender._id)
      .populate('createdBy', 'name email role employeeId');

    if (req.body.shouldNotify === 'true') {
      await sendTenderNotifications(populatedTender);
    }

    logger.info;
    res.status(200).json({
      status: 'success',
      data: { tender: populatedTender }
    });
  } catch (error) {
    next(new AppError('Failed to update tender', 500));
  }
};

// @desc    Delete a tender
// @route   DELETE /api/tenders/:id
const deleteTender = async (req, res, next) => {
  try {
    const tender = await Tender.findById(req.params.id);

    if (!tender) {
      return next(new AppError('No tender found with that ID', 404));
    }

    if (tender.createdBy.toString() !== req.user._id.toString()) {
      return next(new AppError('You are not authorized to delete this tender', 403));
    }

    if (tender.documents && tender.documents.length > 0) {
      tender.documents.forEach(doc => {
        fs.unlink(doc.path, err => {
          if (err) logger.error('Error deleting file:', err);
        });
      });
    }

    await Tender.findByIdAndDelete(req.params.id);

    logger.info('Tender deleted:', {
      timestamp: new Date().toISOString(),
      tenderId: tender._id,
      title: tender.title,
      deletedBy: req.user._id
    });

    res.status(204).json({
      status: 'success',
      message: 'Tender deleted successfully'
    });
  } catch (error) {
    next(new AppError('Error deleting tender', 500));
  }
};

// @desc    Download tender document
// @route   GET /api/tenders/:id/download/:documentId
const downloadTenderDocument = async (req, res, next) => {
  try {
    const tender = await Tender.findById(req.params.id);

    if (!tender) {
      return next(new AppError('Tender not found', 404));
    }

    const document = tender.documents.find(doc => doc._id.toString() === req.params.documentId);

    if (!document) {
      return next(new AppError('Document not found', 404));
    }

    const filePath = path.join(__dirname, '../', document.path);
    if (!fs.existsSync(filePath)) {
      return next(new AppError('File not found on server', 404));
    }

    res.download(filePath, document.originalname);
  } catch (error) {
    next(new AppError('Error downloading file', 500));
  }
};

// @desc    Add a comment to a tender
// @route   POST /api/tenders/:id/comments
const addTenderComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return next(new AppError('Comment text is required and must be a non-empty string', 400));
    }

    const tender = await Tender.findById(id);

    if (!tender) {
      return next(new AppError('No tender found with that ID', 404));
    }

    // Use authenticated user's name or fallback to 'Unknown User'
    const author = req.user?.name || 'Unknown User';

    const newComment = {
      text: text.trim(),
      author,
      createdAt: new Date(),
      timestamp: new Date().toISOString(),
    };

    tender.comments.push(newComment);
    await tender.save();

    const populatedTender = await Tender.findById(tender._id)
      .populate('createdBy', 'name email role employeeId');

    logger.info(`Comment added to tender ${id} by ${author}`, {
      tenderId: tender._id,
      comment: newComment,
    });

    res.status(201).json({
      status: 'success',
      data: { tender: populatedTender },
    });
  } catch (error) {
    logger.error('Failed to add comment:', error);
    next(new AppError('Failed to add comment', 500));
  }
};;

// Helper function for sending notifications
const sendTenderNotifications = async (tender) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const usersToNotify = await User.find({ role: 'admin' });

    const mailPromises = usersToNotify.map(async (user) => {
      if (!validator.isEmail(user.email)) {
        logger.warn(`Invalid email for user ${user.employeeId}: ${user.email}`);
        return { email: user.email, status: 'failed', error: 'Invalid email' };
      }

      try {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: user.email,
          subject: `New Tender Created: ${tender.title}`,
          html: `
            <h1>New Tender Notification</h1>
            <p>A new tender has been created: <strong>${tender.title}</strong>.</p>
            <p>IFB Number: ${tender.ifbNumber}</p>
            <p>Description: ${tender.description}</p>
            <p>Publish Date: ${new Date(tender.publishDate).toLocaleDateString()}</p>
            <p>Opening Date: ${new Date(tender.openingDate).toLocaleDateString()}</p>
            <p>Created by: ${tender.createdBy.name}</p>
          `,
          attachments: tender.documents.length > 0 ? tender.documents.map(doc => ({
            filename: doc.originalname,
            path: doc.path
          })) : []
        });
        return { email: user.email, status: 'success' };
      } catch (error) {
        return { email: user.email, status: 'failed', error: error.message };
      }
    });

    const results = await Promise.all(mailPromises);
    const failures = results.filter(r => r.status === 'failed');

    if (failures.length > 0) {
      logger.error('Failed to send emails:', failures);
    } else {
      logger.info(`Notifications sent for tender ${tender._id}`);
    }
  } catch (error) {
    logger.error('Error sending notifications:', error);
  }
};

module.exports = {
  generateIFBNumber,
  createTender,
  getAllTenders,
  getTender,
  updateTender,
  deleteTender,
  downloadTenderDocument,
  addTenderComment
};