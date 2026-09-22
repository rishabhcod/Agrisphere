const Warehouse = require('../models/Warehouse');

const warehouseController = {
    // GET /api/warehouses - anyone logged in (needed to pick a warehouse when adding stock)
    async getAll(req, res) {
        try {
            const warehouses = await Warehouse.findAll();
            return res.status(200).json({ count: warehouses.length, warehouses });
        } catch (err) {
            console.error('getAll warehouses error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    async getById(req, res) {
        try {
            const warehouse = await Warehouse.findById(req.params.id);
            if (!warehouse) return res.status(404).json({ error: 'Warehouse not found.' });
            return res.status(200).json({ warehouse });
        } catch (err) {
            console.error('getById warehouse error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    // POST /api/warehouses - manager/admin only
    async create(req, res) {
        try {
            const { cooperativeId, name, location, totalCapacityKg } = req.body;
            if (!name || !totalCapacityKg) return res.status(400).json({ error: 'name and totalCapacityKg are required.' });

            const warehouse = await Warehouse.create({ cooperativeId, name, location, totalCapacityKg });
            return res.status(201).json({ message: 'Warehouse created.', warehouse });
        } catch (err) {
            console.error('create warehouse error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    async update(req, res) {
        try {
            const { name, location, totalCapacityKg } = req.body;
            const warehouse = await Warehouse.update(req.params.id, { name, location, totalCapacityKg });
            if (!warehouse) return res.status(404).json({ error: 'Warehouse not found.' });
            return res.status(200).json({ message: 'Warehouse updated.', warehouse });
        } catch (err) {
            console.error('update warehouse error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    async remove(req, res) {
        try {
            const deleted = await Warehouse.delete(req.params.id);
            if (!deleted) return res.status(404).json({ error: 'Warehouse not found.' });
            return res.status(200).json({ message: 'Warehouse deleted.' });
        } catch (err) {
            console.error('remove warehouse error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },
};

module.exports = warehouseController;
