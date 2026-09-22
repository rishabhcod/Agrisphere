const Supplier = require('../models/Supplier');
const InputItem = require('../models/InputItem');

async function getOwnSupplierIdOrFail(req, res) {
    const supplier = await Supplier.findByUserId(req.user.userId);
    if (!supplier) {
        res.status(404).json({ error: 'You need a supplier profile before managing input items.' });
        return null;
    }
    return supplier.supplier_id;
}

const inputItemController = {
    // GET /api/input-items - anyone logged in browses the full catalog
    async getAll(req, res) {
        try {
            const items = await InputItem.findAll();
            return res.status(200).json({ count: items.length, items });
        } catch (err) {
            console.error('getAll input items error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    // POST /api/suppliers/me/input-items
    async create(req, res) {
        try {
            const supplierId = await getOwnSupplierIdOrFail(req, res);
            if (!supplierId) return;

            const { name, category, unit, unitPrice } = req.body;
            if (!name || !unit || unitPrice === undefined) {
                return res.status(400).json({ error: 'name, unit, and unitPrice are required.' });
            }

            const item = await InputItem.create({ supplierId, name, category, unit, unitPrice });
            return res.status(201).json({ message: 'Input item added.', item });
        } catch (err) {
            console.error('create input item error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    // GET /api/suppliers/me/input-items
    async getMine(req, res) {
        try {
            const supplierId = await getOwnSupplierIdOrFail(req, res);
            if (!supplierId) return;
            const items = await InputItem.findBySupplierId(supplierId);
            return res.status(200).json({ count: items.length, items });
        } catch (err) {
            console.error('getMine input items error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    // PUT /api/suppliers/me/input-items/:itemId
    async update(req, res) {
        try {
            const supplierId = await getOwnSupplierIdOrFail(req, res);
            if (!supplierId) return;

            const item = await InputItem.findById(req.params.itemId);
            if (!item || item.supplier_id !== supplierId) return res.status(404).json({ error: 'Input item not found.' });

            const { name, category, unit, unitPrice } = req.body;
            const updated = await InputItem.update(req.params.itemId, { name, category, unit, unitPrice });
            return res.status(200).json({ message: 'Input item updated.', item: updated });
        } catch (err) {
            console.error('update input item error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    // DELETE /api/suppliers/me/input-items/:itemId
    async remove(req, res) {
        try {
            const supplierId = await getOwnSupplierIdOrFail(req, res);
            if (!supplierId) return;

            const item = await InputItem.findById(req.params.itemId);
            if (!item || item.supplier_id !== supplierId) return res.status(404).json({ error: 'Input item not found.' });

            await InputItem.delete(req.params.itemId);
            return res.status(200).json({ message: 'Input item deleted.' });
        } catch (err) {
            console.error('remove input item error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },
};

module.exports = inputItemController;
