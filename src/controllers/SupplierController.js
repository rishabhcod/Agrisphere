const Supplier = require('../models/Supplier');

const supplierController = {
    // POST /api/suppliers/profile
    async createProfile(req, res) {
        try {
            const existing = await Supplier.findByUserId(req.user.userId);
            if (existing) return res.status(409).json({ error: 'A supplier profile already exists for this account.' });

            const { companyName, contactInfo } = req.body;
            if (!companyName) return res.status(400).json({ error: 'companyName is required.' });

            const supplier = await Supplier.create({ userId: req.user.userId, companyName, contactInfo });
            return res.status(201).json({ message: 'Supplier profile created.', supplier });
        } catch (err) {
            console.error('createProfile supplier error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    async getMyProfile(req, res) {
        try {
            const supplier = await Supplier.findByUserId(req.user.userId);
            if (!supplier) return res.status(404).json({ error: 'No supplier profile found yet.' });
            return res.status(200).json({ supplier });
        } catch (err) {
            console.error('getMyProfile supplier error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    async updateMyProfile(req, res) {
        try {
            const supplier = await Supplier.findByUserId(req.user.userId);
            if (!supplier) return res.status(404).json({ error: 'No supplier profile found yet.' });

            const { companyName, contactInfo } = req.body;
            const updated = await Supplier.update(supplier.supplier_id, { companyName, contactInfo });
            return res.status(200).json({ message: 'Profile updated.', supplier: updated });
        } catch (err) {
            console.error('updateMyProfile supplier error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    // GET /api/suppliers - anyone logged in can browse suppliers
    async getAll(req, res) {
        try {
            const suppliers = await Supplier.findAll();
            return res.status(200).json({ count: suppliers.length, suppliers });
        } catch (err) {
            console.error('getAll suppliers error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },
};

module.exports = supplierController;
