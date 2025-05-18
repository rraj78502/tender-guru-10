const mongoose = require('mongoose');

const quarterlyTargetSchema = new mongoose.Schema({
  quarter: {
    type: String,
    enum: ['Q1', 'Q2', 'Q3', 'Q4'],
    required: [true, 'Quarter is required']
  },
  target_details: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['Planned', 'In Progress', 'Completed'],
    default: 'Planned'
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

const procurementPlanSchema = new mongoose.Schema({
  policy_number: {
    type: String,
    required: [true, 'Policy number is required'],
    unique: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: ['Wireline', 'Wireless']
  },
  project_name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true
  },
  project_description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true
  },
  estimated_cost: {
    type: Number,
    required: [true, 'Estimated cost is required']
  },
  proposed_budget: {
    type: Number,
    required: [true, 'Proposed budget is required']
  },
  proposed_budget_percentage: {
    type: Number
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'approved', 'rejected'],
    default: 'draft'
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Procurement plan must belong to a user']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  quarterly_targets: [quarterlyTargetSchema],
});

const ProcurementPlan = mongoose.model('ProcurementPlan', procurementPlanSchema);

module.exports = ProcurementPlan;