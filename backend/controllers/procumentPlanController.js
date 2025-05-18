const ProcurementPlan = require('../models/procumentsPlanModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const nodemailer = require('nodemailer');
const validator = require('validator');
const winston = require('winston');

// Set up Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/procurementPlan.log' }),
    new winston.transports.Console()
  ]
});

// @desc    Generate Policy Number
// @route   GET /api/procurement-plans/generate-policy-number
const generatePolicyNumber = async (req, res, next) => {
    try {
      const plansCount = await ProcurementPlan.countDocuments();
      const department = parseInt(req.query.department) || 1; // Default to 1 if not provided
      const deptCode = department === 1 ? 'WL' : 'WS'; // Map 1 to WL, 2 to WS
      const policyNumber = `PP-${new Date().getFullYear()}-${String(plansCount + 1).padStart(4, '0')}-${deptCode}-N-${department}`; // Use numeric index
  
      res.status(200).json({
        status: 'success',
        data: { policyNumber }
      });
    } catch (error) {
      next(new AppError('Failed to generate policy number', 500));
    }
  };

// @desc    Create a new procurement plan
// @route   POST /api/procurement-plans
const createProcurementPlan = async (req, res, next) => {
  try {
    const { 
      policy_number, 
      department, 
      project_name, 
      project_description, 
      estimated_cost, 
      proposed_budget, 
      status, 
      quarterly_targets, 
      shouldNotify 
    } = req.body;

    logger.info('Creating procurement plan', { body: req.body });

    const proposedBudgetPercentage = (proposed_budget / estimated_cost) * 100;

    const procurementPlan = new ProcurementPlan({
      policy_number,
      department,
      project_name,
      project_description,
      estimated_cost,
      proposed_budget,
      proposed_budget_percentage: Math.round(proposedBudgetPercentage),
      status,
      createdBy: req.user._id,
      quarterly_targets: quarterly_targets.map(target => ({
        ...target,
        created_at: new Date()
      })),
    //   comments: []
    });

    await procurementPlan.save();

    const populatedPlan = await ProcurementPlan.findById(procurementPlan._id)
      .populate('createdBy', 'name email role employeeId');

    if (shouldNotify === true) { // Fix: Compare as boolean
      logger.info('shouldNotify is true, sending notifications', { planId: procurementPlan._id });
      await sendProcurementPlanNotifications(populatedPlan);
    } else {
      logger.info('shouldNotify is false, skipping notifications', { planId: procurementPlan._id });
    }

    res.status(201).json({
      status: 'success',
      data: { procurementPlan: populatedPlan }
    });
  } catch (error) {
    logger.error('Error creating procurement plan', { error: error.message });
    next(error);
  }
};

// @desc    Get all procurement plans
// @route   GET /api/procurement-plans
const getAllProcurementPlans = async (req, res, next) => {
  try {
    const procurementPlans = await ProcurementPlan.find()
      .sort('-createdAt')
      .populate('createdBy', 'name email role employeeId');

    res.status(200).json({
      status: 'success',
      results: procurementPlans.length,
      data: { procurementPlans }
    });
  } catch (error) {
    next(new AppError('Failed to fetch procurement plans', 500));
  }
};

// @desc    Get single procurement plan
// @route   GET /api/procurement-plans/:id
const getProcurementPlan = async (req, res, next) => {
  try {
    const procurementPlan = await ProcurementPlan.findById(req.params.id)
      .populate('createdBy', 'name email role employeeId');

    if (!procurementPlan) {
      return next(new AppError('Procurement plan not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { procurementPlan }
    });
  } catch (error) {
    next(new AppError('Failed to fetch procurement plan', 500));
  }
};

// @desc    Update a procurement plan
// @route   PATCH /api/procurement-plans/:id
const updateProcurementPlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info('Update procurement plan ID:', id);

    const procurementPlan = await ProcurementPlan.findById(id).populate(
      'createdBy', 'name email role employeeId'
    );

    if (!procurementPlan) {
      return next(new AppError('No procurement plan found with that ID', 404));
    }

    if (procurementPlan.createdBy._id.toString() !== req.user._id.toString()) {
      return next(new AppError('You are not authorized to update this procurement plan', 403));
    }

    const allowedUpdates = {
      policy_number: req.body.policy_number,
      department: req.body.department,
      project_name: req.body.project_name,
      project_description: req.body.project_description,
      estimated_cost: req.body.estimated_cost,
      proposed_budget: req.body.proposed_budget,
      status: req.body.status,
      quarterly_targets: req.body.quarterly_targets,
      shouldNotify: req.body.shouldNotify
    };

    Object.keys(allowedUpdates).forEach(
      (key) => allowedUpdates[key] === undefined && delete allowedUpdates[key]
    );

    if (allowedUpdates.estimated_cost && allowedUpdates.proposed_budget) {
      allowedUpdates.proposed_budget_percentage = Math.round(
        (allowedUpdates.proposed_budget / allowedUpdates.estimated_cost) * 100
      );
    } else if (allowedUpdates.estimated_cost) {
      allowedUpdates.proposed_budget_percentage = Math.round(
        (procurementPlan.proposed_budget / allowedUpdates.estimated_cost) * 100
      );
    } else if (allowedUpdates.proposed_budget) {
      allowedUpdates.proposed_budget_percentage = Math.round(
        (allowedUpdates.proposed_budget / procurementPlan.estimated_cost) * 100
      );
    }

    Object.assign(procurementPlan, allowedUpdates);
    await procurementPlan.save();

    const populatedPlan = await ProcurementPlan.findById(procurementPlan._id)
      .populate('createdBy', 'name email role employeeId');

    if (req.body.shouldNotify === true) { // Fix: Compare as boolean
      logger.info('shouldNotify is true, sending notifications', { planId: procurementPlan._id });
      await sendProcurementPlanNotifications(populatedPlan);
    } else {
      logger.info('shouldNotify is false, skipping notifications', { planId: procurementPlan._id });
    }

    res.status(200).json({
      status: 'success',
      data: { procurementPlan: populatedPlan }
    });
  } catch (error) {
    next(new AppError('Failed to update procurement plan', 500));
  }
};

// @desc    Delete a procurement plan
// @route   DELETE /api/procurement-plans/:id
const deleteProcurementPlan = async (req, res, next) => {
  try {
    const procurementPlan = await ProcurementPlan.findById(req.params.id);

    if (!procurementPlan) {
      return next(new AppError('No procurement plan found with that ID', 404));
    }

    if (procurementPlan.createdBy.toString() !== req.user._id.toString()) {
      return next(new AppError('You are not authorized to delete this procurement plan', 403));
    }

    await ProcurementPlan.findByIdAndDelete(req.params.id);

    logger.info('Procurement plan deleted:', {
      timestamp: new Date().toISOString(),
      procurementPlanId: procurementPlan._id,
      project_name: procurementPlan.project_name,
      deletedBy: req.user._id
    });

    res.status(204).json({
      status: 'success',
      message: 'Procurement plan deleted successfully'
    });
  } catch (error) {
    next(new AppError('Error deleting procurement plan', 500));
  }
};

// @desc    Add a comment to a procurement plan
// @route   POST /api/procurement-plans/:id/comments
// const addProcurementPlanComment = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { text } = req.body;

//     if (!text || typeof text !== 'string' || text.trim().length === 0) {
//       return next(new AppError('Comment text is required and must be a non-empty string', 400));
//     }

//     const procurementPlan = await ProcurementPlan.findById(id);

//     if (!procurementPlan) {
//       return next(new AppError('No procurement plan found with that ID', 404));
//     }

//     const author = req.user?.name || 'Unknown User';

//     const newComment = {
//       text: text.trim(),
//       author,
//       createdAt: new Date(),
//       timestamp: new Date().toISOString(),
//     };

//     procurementPlan.comments.push(newComment);
//     await procurementPlan.save();

//     const populatedPlan = await ProcurementPlan.findById(procurementPlan._id)
//       .populate('createdBy', 'name email role employeeId');

//     logger.info(`Comment added to procurement plan ${id} by ${author}`, {
//       procurementPlanId: procurementPlan._id,
//       comment: newComment,
//     });

//     res.status(201).json({
//       status: 'success',
//       data: { procurementPlan: populatedPlan },
//     });
//   } catch (error) {
//     logger.error('Failed to add comment:', error);
//     next(new AppError('Failed to add comment', 500));
//   }
// };

// Helper function for sending notifications
const sendProcurementPlanNotifications = async (procurementPlan) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const usersToNotify = await User.find({ role: 'admin' });
    logger.info('Found admin users to notify', { count: usersToNotify.length, emails: usersToNotify.map(u => u.email) });

    if (usersToNotify.length === 0) {
      logger.warn('No admin users found to notify');
      return;
    }

    const mailPromises = usersToNotify.map(async (user) => {
      if (!validator.isEmail(user.email)) {
        logger.warn(`Invalid email for user ${user.employeeId}: ${user.email}`);
        return { email: user.email, status: 'failed', error: 'Invalid email' };
      }

      try {
        const info = await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: user.email,
          subject: `New Procurement Plan Created: ${procurementPlan.project_name}`,
          html: `
            <h1>New Procurement Plan Notification</h1>
            <p>A new procurement plan has been created: <strong>${procurementPlan.project_name}</strong>.</p>
            <p>Policy Number: ${procurementPlan.policy_number}</p>
            <p>Department: ${procurementPlan.department}</p>
            <p>Description: ${procurementPlan.project_description}</p>
            <p>Estimated Cost: ${procurementPlan.estimated_cost} NPR</p>
            <p>Proposed Budget: ${procurementPlan.proposed_budget} NPR</p>
            <p>Created by: ${procurementPlan.createdBy.name}</p>
          `
        });
        logger.info('Email sent successfully', { email: user.email, messageId: info.messageId });
        return { email: user.email, status: 'success' };
      } catch (error) {
        logger.error('Failed to send email', { email: user.email, error: error.message });
        return { email: user.email, status: 'failed', error: error.message };
      }
    });

    const results = await Promise.all(mailPromises);
    const failures = results.filter(r => r.status === 'failed');

    if (failures.length > 0) {
      logger.error('Failed to send emails:', failures);
      throw new Error(`Failed to send emails to some recipients: ${failures.map(f => f.email).join(', ')}`);
    } else {
      logger.info(`Notifications sent for procurement plan ${procurementPlan._id}`);
    }
  } catch (error) {
    logger.error('Error sending notifications:', error);
    throw error; // Propagate error to controller
  }
};

module.exports = {
  generatePolicyNumber,
  createProcurementPlan,
  getAllProcurementPlans,
  getProcurementPlan,
  updateProcurementPlan,
  deleteProcurementPlan
//   addProcurementPlanComment
};