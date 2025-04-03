
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  specificationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Specification',
    required: true
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  actualDate: Date,
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'rescheduled'],
    default: 'scheduled'
  },
  reviewers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  }],
  minutes: String,
  comments: [String],
  nextReviewDate: Date,
  documents: [{
    id: Number,
    name: String,
    url: String,
    uploadedAt: Date,
    type: {
      type: String,
      enum: ['review_minutes', 'supporting_document', 'final_approval'],
      default: 'supporting_document'
    }
  }]
}, { timestamps: true });

// Add indexes for better query performance
reviewSchema.index({ specificationId: 1 });
reviewSchema.index({ status: 1 });
reviewSchema.index({ scheduledDate: 1 });

module.exports = mongoose.model('Review', reviewSchema);
