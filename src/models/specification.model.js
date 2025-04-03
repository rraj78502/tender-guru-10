
const mongoose = require('mongoose');

const documentVersionSchema = new mongoose.Schema({
  version: {
    type: Number,
    required: true
  },
  documentUrl: {
    type: String,
    required: true
  },
  changes: String,
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

const specificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for the specification']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  version: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'under_review', 'revision_required', 'approved', 'rejected'],
    default: 'draft'
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  documentUrl: String,
  committeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Committee'
  },
  comments: [String],
  versionHistory: [documentVersionSchema]
}, { timestamps: true });

// Add indexes for better query performance
specificationSchema.index({ status: 1 });
specificationSchema.index({ submittedBy: 1 });
specificationSchema.index({ committeeId: 1 });

module.exports = mongoose.model('Specification', specificationSchema);
