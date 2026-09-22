const Farmer = require('../models/Farmer');
const InventoryItem = require('../models/InventoryItem');

const VALID_STATUSES = ['in_storage', 'spoiled', 'dispatched', 'sold'];

const inventoryController = {
    // GET /api/inventory - manager/admin, full visibility across the cooperative
    async getAll(req, res) {
        try {
            const items = await InventoryItem.findAll();
            return res.status(200).json({ count: items.length, items });
        } catch (err) {
            console.error('getAll inventory error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    // GET /api/inventory/me - a farmer viewing their own stored produce
    async getMine(req, res) {
        try {
            const farmer = await Farmer.findByUserId(req.user.userId);
            if (!farmer) return res.status(404).json({ error: 'You need a farmer profile first.' });
            const items = await InventoryItem.findByFarmerId(farmer.farmer_id);
            return res.status(200).json({ count: items.length, items });
        } catch (err) {
            console.error('getMine inventory error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    // POST /api/inventory - manager/admin only (recording stock into a warehouse)
    async create(req, res) {
        try {
            const { warehouseId, cropId, farmerId, quantityKg, expiryEstimateDate } = req.body;
            if (!warehouseId || !cropId || !quantityKg) {
                return res.status(400).json({ error: 'warehouseId, cropId, and quantityKg are required.' });
            }
            const item = await InventoryItem.create({ warehouseId, cropId, farmerId, quantityKg, expiryEstimateDate });
            return res.status(201).json({ message: 'Inventory item recorded.', item });
        } catch (err) {
            console.error('create inventory error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    // PUT /api/inventory/:id - manager/admin updates quantity/status (e.g. marking spoiled/dispatched)
    async update(req, res) {
        try {
            const { quantityKg, status } = req.body;
            if (status && !VALID_STATUSES.includes(status)) {
                return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
            }
            const item = await InventoryItem.updateStatusOrQuantity(req.params.id, { quantityKg, status });
            if (!item) return res.status(404).json({ error: 'Inventory item not found.' });
            return res.status(200).json({ message: 'Inventory item updated.', item });
        } catch (err) {
            console.error('update inventory error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    async remove(req, res) {
        try {
            const deleted = await InventoryItem.delete(req.params.id);
            if (!deleted) return res.status(404).json({ error: 'Inventory item not found.' });
            return res.status(200).json({ message: 'Inventory item deleted.' });
        } catch (err) {
            console.error('remove inventory error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },
};

module.exports = inventoryController;
