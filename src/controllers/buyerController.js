const Buyer = require('../models/Buyer');

const buyerController = {
    async createProfile(req, res) {
        try {
            const existing = await Buyer.findByUserId(req.user.userId);
            if (existing) return res.status(409).json({ error: 'A buyer profile already exists for this account.' });

            const { businessName, address } = req.body;
            const buyer = await Buyer.create({ userId: req.user.userId, businessName, address });
            return res.status(201).json({ message: 'Buyer profile created.', buyer });
        } catch (err) {
            console.error('createProfile buyer error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    async getMyProfile(req, res) {
        try {
            const buyer = await Buyer.findByUserId(req.user.userId);
            if (!buyer) return res.status(404).json({ error: 'No buyer profile found yet.' });
            return res.status(200).json({ buyer });
        } catch (err) {
            console.error('getMyProfile buyer error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    async updateMyProfile(req, res) {
        try {
            const buyer = await Buyer.findByUserId(req.user.userId);
            if (!buyer) return res.status(404).json({ error: 'No buyer profile found yet.' });

            const { businessName, address } = req.body;
            const updated = await Buyer.update(buyer.buyer_id, { businessName, address });
            return res.status(200).json({ message: 'Profile updated.', buyer: updated });
        } catch (err) {
            console.error('updateMyProfile buyer error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },
};

module.exports = buyerController;
