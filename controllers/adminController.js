const User = require('../models/User');
const Lead = require('../models/Lead');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
};

// @desc    Create new user
// @route   POST /api/admin/users
// @access  Admin
const createUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            username,
            email,
            password,
            role: role || 'user'
        });

        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Failed to create user' });
    }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Admin
const updateUser = async (req, res) => {
    try {
        const { username, email, role } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.username = username || user.username;
        user.email = email || user.email;
        user.role = role || user.role;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Failed to update user' });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent deleting yourself
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'Cannot delete your own account' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Failed to delete user' });
    }
};

// @desc    Get system analytics
// @route   GET /api/admin/analytics
// @access  Admin
const getAnalytics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalLeads = await Lead.countDocuments();

        const leadsByStatus = await Lead.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const leadsByDistrict = await Lead.aggregate([
            {
                $group: {
                    _id: '$district',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        const recentLeads = await Lead.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select('business status createdAt');

        res.json({
            totalUsers,
            totalLeads,
            leadsByStatus,
            leadsByDistrict,
            recentLeads
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ message: 'Failed to fetch analytics' });
    }
};

// @desc    Get activity logs
// @route   GET /api/admin/activity-logs
// @access  Admin
const getActivityLogs = async (req, res) => {
    try {
        const leads = await Lead.find()
            .select('business logs')
            .sort({ updatedAt: -1 });

        const allLogs = [];
        leads.forEach(lead => {
            if (lead.logs && lead.logs.length > 0) {
                lead.logs.forEach(log => {
                    allLogs.push({
                        business: lead.business,
                        ...log.toObject()
                    });
                });
            }
        });

        // Sort by date (most recent first)
        allLogs.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json(allLogs.slice(0, 100)); // Return last 100 logs
    } catch (error) {
        console.error('Error fetching activity logs:', error);
        res.status(500).json({ message: 'Failed to fetch activity logs' });
    }
};

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getAnalytics,
    getActivityLogs
};
