const mongoose = require('mongoose');

const tenderSchema = new mongoose.Schema({
  ifbNumber: {
    type: String,
    required: [true, 'IFB number is required'],
    unique: true
  },
  title: {
    type: String,
    required: [true, 'Tender title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Tender description is required'],
    trim: true
  },
  publishDate: {
    type: Date,
    required: [true, 'Publish date is required']
  },
  openingDate: {
    type: Date,
    required: [true, 'Opening date is required']
  },
  bidValidity: {
    type: Number,
    required: [true, 'Bid validity is required'],
    default: 90
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'closed'],
    default: 'draft'
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  documents: [{
    filename: String,
    path: String,
    originalname: String,
    mimetype: String,
    size: Number
  }],
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Tender must belong to a user']
  },
  createdAt: {
    type: Date,
    default: Date.now 
  },
  comments: [{
    text: String,
    author: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    timestamp: {
      type: String,
      default: () => new Date().toISOString()
    }
  }]
});

const Tender = mongoose.model('Tender', tenderSchema);

module.exports = Tender;