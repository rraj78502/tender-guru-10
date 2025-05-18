const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const permissionMiddleware = require('../middleware/permisssionMiddleware');
const procurementPlanController = require('../controllers/procumentPlanController');

// Protect all procurement plan routes
router.use(authController.protect);

// GET /api/procurement-plans/generate-policy-number - Generate policy number
router.get(
  '/generate-policy-number',
  permissionMiddleware.checkAnyPermission(['manage-procurement-plans']),
  procurementPlanController.generatePolicyNumber
);

// GET /api/procurement-plans/getallprocurementplans - Get all procurement plans
router.get(
  '/getallprocurementplans',
  permissionMiddleware.checkAnyPermission(['manage-procurement-plans']),
  procurementPlanController.getAllProcurementPlans
);

// POST /api/procurement-plans/createprocurementplan - Create new procurement plan
router.post(
  '/createprocurementplan',
  permissionMiddleware.checkAnyPermission(['manage-procurement-plans']),
  procurementPlanController.createProcurementPlan
);

// GET /api/procurement-plans/getprocurementplanbyid/:id - Get single procurement plan
router.get(
  '/getprocurementplanbyid/:id',
  permissionMiddleware.checkAnyPermission(['manage-procurement-plans']),
  procurementPlanController.getProcurementPlan
);

// PATCH /api/procurement-plans/updateprocurementplan/:id - Update a procurement plan
router.patch(
  '/updateprocurementplan/:id',
  permissionMiddleware.checkAnyPermission(['manage-procurement-plans']),
  procurementPlanController.updateProcurementPlan
);

// DELETE /api/procurement-plans/deleteprocurementplan/:id - Delete a procurement plan
router.delete(
  '/deleteprocurementplan/:id',
  permissionMiddleware.checkAnyPermission(['manage-procurement-plans']),
  procurementPlanController.deleteProcurementPlan
);

// POST /api/procurement-plans/:id/comments - Add procurement plan comment
// router.post(
//   '/:id/comments',
//   permissionMiddleware.checkAnyPermission(['manage-procurement-plans']),
//   procurementPlanController.addProcurementPlanComment
// );

module.exports = router;