const Lead = require('../models/Lead');

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
exports.getAllLeads = async (req, res) => {
    try {
        const leads = await Lead.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(leads);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
exports.getLeadById = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead || lead.userId.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: 'Lead not found' });
        }
        res.json(lead);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new lead
// @route   POST /api/leads
// @access  Private
exports.createLead = async (req, res) => {
    try {
        const { business, contact, status, location, district } = req.body;

        const lead = new Lead({
            userId: req.user._id,
            business,
            contact,
            status: status || 'New',
            location,
            district,
            logs: [{
                from: '-',
                to: status || 'New',
                note: 'Lead created',
                date: new Date()
            }]
        });

        const newLead = await lead.save();
        res.status(201).json(newLead);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Public
exports.updateLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        const { business, contact, status, location, district } = req.body;

        // If status changed, add log entry
        if (status && status !== lead.status) {
            lead.logs.unshift({
                from: lead.status,
                to: status,
                note: req.body.note || 'Status updated',
                date: new Date()
            });
        }

        lead.business = business || lead.business;
        lead.contact = contact || lead.contact;
        lead.status = status || lead.status;
        lead.location = location || lead.location;
        lead.district = district || lead.district;

        const updatedLead = await lead.save();
        res.json(updatedLead);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Public
exports.deleteLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        await lead.deleteOne();
        res.json({ message: 'Lead deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add activity log to lead
// @route   POST /api/leads/:id/log
// @access  Public
exports.addLog = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        const { from, to, note } = req.body;

        lead.logs.unshift({
            from,
            to,
            note: note || 'No description provided',
            date: new Date()
        });

        const updatedLead = await lead.save();
        res.json(updatedLead);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
