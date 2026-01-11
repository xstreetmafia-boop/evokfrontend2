const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

// @desc    Get dashboard statistics
// @route   GET /api/stats
// @access  Public
router.get('/', async (req, res) => {
    try {
        const leads = await Lead.find();

        const stats = {
            total: leads.length,
            pending: leads.filter(l => l.status === 'New').length,
            meetings: leads.filter(l => l.status === 'Meeting Scheduled').length,
            negotiating: leads.filter(l => l.status.includes('Negotiation')).length,
            won: leads.filter(l => l.status === 'Won').length,
            lost: leads.filter(l => l.status === 'Lost').length,
            contacted: leads.filter(l => l.status === 'Contacted').length,
            byStatus: {
                'New': leads.filter(l => l.status === 'New').length,
                'Contacted': leads.filter(l => l.status === 'Contacted').length,
                'Meeting Scheduled': leads.filter(l => l.status === 'Meeting Scheduled').length,
                'Under Negotiation': leads.filter(l => l.status === 'Under Negotiation').length,
                'Won': leads.filter(l => l.status === 'Won').length,
                'Lost': leads.filter(l => l.status === 'Lost').length
            }
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
