const express = require('express');
const router = express.Router();
const {
    getAllLeads,
    getLeadById,
    createLead,
    updateLead,
    deleteLead,
    addLog
} = require('../controllers/leadController');

router.get('/', getAllLeads);
router.get('/:id', getLeadById);
router.post('/', createLead);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);
router.post('/:id/log', addLog);

module.exports = router;
