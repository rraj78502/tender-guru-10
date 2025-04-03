
const Specification = require('../models/specification.model');
const Review = require('../models/review.model');
const Employee = require('../models/employee.model');
const Notification = require('../models/notification.model');
const fs = require('fs');
const path = require('path');

// Create directory for file uploads if it doesn't exist
const uploadDir = path.join(__dirname, '../../uploads/specifications');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Helper function to send notifications
const sendNotification = async (recipient, message, type, committeeInfo = null) => {
  try {
    const notification = new Notification({
      recipient,
      message,
      type,
      committeeInfo
    });
    
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

// Create a new specification
exports.createSpecification = async (req, res) => {
  try {
    const { title, description, committeeId } = req.body;
    
    const specification = new Specification({
      title,
      description,
      committeeId,
      submittedBy: req.user.id,
      version: 1,
      status: 'draft'
    });
    
    await specification.save();
    
    res.status(201).json({
      success: true,
      data: specification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create specification',
      error: error.message
    });
  }
};

// Get all specifications
exports.getAllSpecifications = async (req, res) => {
  try {
    const specifications = await Specification.find()
      .populate('submittedBy', 'name email')
      .populate('committeeId', 'name formation_date');
    
    res.status(200).json({
      success: true,
      count: specifications.length,
      data: specifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch specifications',
      error: error.message
    });
  }
};

// Get a specification by ID
exports.getSpecificationById = async (req, res) => {
  try {
    const specification = await Specification.findById(req.params.id)
      .populate('submittedBy', 'name email')
      .populate('committeeId', 'name formation_date');
    
    if (!specification) {
      return res.status(404).json({
        success: false,
        message: 'Specification not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: specification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch specification',
      error: error.message
    });
  }
};

// Update a specification
exports.updateSpecification = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    
    const specification = await Specification.findById(req.params.id);
    
    if (!specification) {
      return res.status(404).json({
        success: false,
        message: 'Specification not found'
      });
    }
    
    specification.title = title || specification.title;
    specification.description = description || specification.description;
    
    if (status && status !== specification.status) {
      specification.status = status;
      
      // Notify committee members about status change
      if (specification.committeeId) {
        const committeeMembersQuery = await Employee.find({ 
          committees: { $elemMatch: { committeeId: specification.committeeId } } 
        });
        
        committeeMembersQuery.forEach(async (member) => {
          await sendNotification(
            member._id,
            `Specification "${specification.title}" status changed to ${status}`,
            'status_change',
            { committeeId: specification.committeeId }
          );
        });
      }
    }
    
    await specification.save();
    
    res.status(200).json({
      success: true,
      data: specification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update specification',
      error: error.message
    });
  }
};

// Delete a specification
exports.deleteSpecification = async (req, res) => {
  try {
    const specification = await Specification.findById(req.params.id);
    
    if (!specification) {
      return res.status(404).json({
        success: false,
        message: 'Specification not found'
      });
    }
    
    await specification.remove();
    
    res.status(200).json({
      success: true,
      message: 'Specification deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete specification',
      error: error.message
    });
  }
};

// Get version history
exports.getVersionHistory = async (req, res) => {
  try {
    const specification = await Specification.findById(req.params.id);
    
    if (!specification) {
      return res.status(404).json({
        success: false,
        message: 'Specification not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: specification.versionHistory || []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch version history',
      error: error.message
    });
  }
};

// Add new version
exports.addNewVersion = async (req, res) => {
  try {
    const { changes } = req.body;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No document uploaded'
      });
    }
    
    const specification = await Specification.findById(req.params.id);
    
    if (!specification) {
      return res.status(404).json({
        success: false,
        message: 'Specification not found'
      });
    }
    
    const newVersion = {
      version: specification.version + 1,
      documentUrl: `/uploads/specifications/${file.filename}`,
      changes: changes || 'New version uploaded',
      submittedBy: req.user.id,
      submittedAt: new Date()
    };
    
    specification.version = newVersion.version;
    specification.documentUrl = newVersion.documentUrl;
    specification.lastModified = new Date();
    
    if (!specification.versionHistory) {
      specification.versionHistory = [];
    }
    
    specification.versionHistory.push(newVersion);
    
    await specification.save();
    
    res.status(200).json({
      success: true,
      data: newVersion
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add new version',
      error: error.message
    });
  }
};

// Get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('specificationId', 'title version')
      .populate('reviewers', 'name email');
    
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
};

// Get review by ID
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId)
      .populate('specificationId', 'title version documentUrl')
      .populate('reviewers', 'name email');
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch review',
      error: error.message
    });
  }
};

// Schedule a review
exports.scheduleReview = async (req, res) => {
  try {
    const { scheduledDate, reviewers } = req.body;
    
    const specification = await Specification.findById(req.params.id);
    
    if (!specification) {
      return res.status(404).json({
        success: false,
        message: 'Specification not found'
      });
    }
    
    const review = new Review({
      specificationId: specification._id,
      scheduledDate,
      status: 'scheduled',
      reviewers
    });
    
    await review.save();
    
    // Notify reviewers
    if (reviewers && reviewers.length > 0) {
      reviewers.forEach(async (reviewerId) => {
        await sendNotification(
          reviewerId,
          `You have been assigned to review specification "${specification.title}" on ${new Date(scheduledDate).toLocaleDateString()}`,
          'committee',
          {
            committeeId: specification.committeeId,
            role: 'member'
          }
        );
      });
    }
    
    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to schedule review',
      error: error.message
    });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const { status, actualDate, nextReviewDate } = req.body;
    
    const review = await Review.findById(req.params.reviewId);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    if (status) review.status = status;
    if (actualDate) review.actualDate = actualDate;
    if (nextReviewDate) review.nextReviewDate = nextReviewDate;
    
    await review.save();
    
    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update review',
      error: error.message
    });
  }
};

// Upload review document
exports.uploadReviewDocument = async (req, res) => {
  try {
    const { reviewId, documentType } = req.body;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    const document = {
      id: new Date().getTime(),
      name: file.originalname,
      url: `/uploads/specifications/${file.filename}`,
      uploadedAt: new Date(),
      type: documentType || 'supporting_document'
    };
    
    if (!review.documents) {
      review.documents = [];
    }
    
    review.documents.push(document);
    await review.save();
    
    res.status(200).json({
      success: true,
      data: document
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to upload document',
      error: error.message
    });
  }
};

// Get review documents
exports.getReviewDocuments = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: review.documents || []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch review documents',
      error: error.message
    });
  }
};

// Add review minutes
exports.addReviewMinutes = async (req, res) => {
  try {
    const { minutes, committeeId } = req.body;
    
    const review = await Review.findById(req.params.reviewId);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    review.minutes = minutes;
    review.status = 'completed';
    
    await review.save();
    
    // Notify committee members about the minutes
    if (committeeId) {
      const committeeMembersQuery = await Employee.find({ 
        committees: { $elemMatch: { committeeId } } 
      });
      
      committeeMembersQuery.forEach(async (member) => {
        await sendNotification(
          member._id,
          `Review minutes have been added for specification review #${review._id}`,
          'committee',
          { committeeId }
        );
      });
    }
    
    res.status(200).json({
      success: true,
      review: {
        id: review._id,
        minutes: review.minutes,
        updatedAt: review.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add review minutes',
      error: error.message
    });
  }
};
