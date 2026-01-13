const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminAuth');
const {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getAnalytics,
    getActivityLogs
} = require('../controllers/adminController');

// All routes require authentication and admin role
router.use(protect);
router.use(adminOnly);

// User management routes
router.route('/users')
    .get(getAllUsers)
    .post(createUser);

router.route('/users/:id')
    .put(updateUser)
    .delete(deleteUser);

// Analytics routes
router.get('/analytics', getAnalytics);
router.get('/activity-logs', getActivityLogs);

module.exports = router;
