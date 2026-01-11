const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    note: {
        type: String,
        default: 'No description provided'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const leadSchema = new mongoose.Schema({
    business: {
        type: String,
        required: [true, 'Business name is required'],
        trim: true
    },
    contact: {
        type: String,
        required: [true, 'Contact number is required'],
        trim: true
    },
    status: {
        type: String,
        required: true,
        enum: [
            'New',
            'Contacted',
            'Meeting Scheduled',
            'Quote Issued',
            'Quote Revised',
            'Under Negotiation',
            'Tried To Connect',
            'Future Project',
            'Forwarded',
            'Won',
            'Lost'
        ],
        default: 'New'
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
    },
    district: {
        type: String,
        required: [true, 'District is required'],
        enum: [
            'Thiruvananthapuram',
            'Kollam',
            'Pathanamthitta',
            'Alappuzha',
            'Kottayam',
            'Idukki',
            'Ernakulam',
            'Thrissur',
            'Palakkad',
            'Malappuram',
            'Kozhikode',
            'Wayanad',
            'Kannur',
            'Kasaragod'
        ]
    },
    logs: [logSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('Lead', leadSchema);
