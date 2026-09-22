const Equipment = require('../models/Equipment');

const equipmentController = {
    // GET /api/equipment - anyone logged in browses AVAILABLE equipment
    async getAvailable(req, res) {
        try {
            const equipment = await Equipment.findAvailable();
            return res.status(200).json({ count: equipment.length, equipment });
        } catch (err) {
            console.error('getAvailable equipment error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    // POST /api/equipment - equipment_owner only
    async create(req, res) {
        try {
            const { cooperativeId, equipmentType, dailyRate } = req.body;
            if (!equipmentType || !dailyRate) return res.status(400).json({ error: 'equipmentType and dailyRate are required.' });

            const equipment = await Equipment.create({ ownerId: req.user.userId, cooperativeId, equipmentType, dailyRate });
            return res.status(201).json({ message: 'Equipment listed.', equipment });
        } catch (err) {
            console.error('create equipment error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    // GET /api/equipment/me - owner's own listings
    async getMine(req, res) {
        try {
            const equipment = await Equipment.findByOwnerId(req.user.userId);
            return res.status(200).json({ count: equipment.length, equipment });
        } catch (err) {
            console.error('getMine equipment error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    // PUT /api/equipment/:id - owner updates their own listing
    async update(req, res) {
        try {
            const equipment = await Equipment.findById(req.params.id);
            if (!equipment || equipment.owner_id !== req.user.userId) return res.status(404).json({ error: 'Equipment not found.' });

            const { equipmentType, dailyRate, availabilityStatus } = req.body;
            const updated = await Equipment.update(req.params.id, { equipmentType, dailyRate, availabilityStatus });
            return res.status(200).json({ message: 'Equipment updated.', equipment: updated });
        } catch (err) {
            console.error('update equipment error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    // DELETE /api/equipment/:id - owner deletes their own listing
    async remove(req, res) {
        try {
            const equipment = await Equipment.findById(req.params.id);
            if (!equipment || equipment.owner_id !== req.user.userId) return res.status(404).json({ error: 'Equipment not found.' });

            await Equipment.delete(req.params.id);
            return res.status(200).json({ message: 'Equipment deleted.' });
        } catch (err) {
            console.error('remove equipment error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },
};

module.exports = equipmentController;
