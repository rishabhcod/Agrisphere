const Dashboard = require('../models/Dashboard');

const dashboardController = {
    // GET /api/dashboard/summary - manager/admin only
    async getSummary(req, res) {
        try {
            const summary = await Dashboard.getSummary();
            return res.status(200).json({ summary });
        } catch (err) {
            console.error('getSummary dashboard error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },
};

module.exports = dashboardController;
