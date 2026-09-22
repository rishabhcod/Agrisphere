const Farmer = require('../models/Farmer');
const Supplier = require('../models/Supplier');
const ProcurementOrder = require('../models/ProcurementOrder');

const VALID_STATUSES = ['pending', 'approved', 'delivered', 'cancelled'];

const procurementOrderController = {
    // POST /api/procurement-orders  (farmer only)
    // body: { supplierId, items: [{ inputItemId, quantity }, ...] }
    async create(req, res) {
        try {
            const farmer = await Farmer.findByUserId(req.user.userId);
            if (!farmer) return res.status(404).json({ error: 'You need a farmer profile first.' });

            const { supplierId, items } = req.body;
            if (!supplierId || !Array.isArray(items) || items.length === 0) {
                return res.status(400).json({ error: 'supplierId and a non-empty items array are required.' });
            }

            const order = await ProcurementOrder.createWithItems({ farmerId: farmer.farmer_id, supplierId, items });
            return res.status(201).json({ message: 'Procurement order placed.', order });
        } catch (err) {
            console.error('create procurement order error:', err);
            return res.status(400).json({ error: err.message || 'Could not place the order.' });
        }
    },

    // GET /api/procurement-orders/me  (farmer's own orders)
    async getMine(req, res) {
        try {
            const farmer = await Farmer.findByUserId(req.user.userId);
            if (!farmer) return res.status(404).json({ error: 'You need a farmer profile first.' });
            const orders = await ProcurementOrder.findByFarmerId(farmer.farmer_id);
            return res.status(200).json({ count: orders.length, orders });
        } catch (err) {
            console.error('getMine procurement orders error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    // GET /api/procurement-orders/incoming  (supplier's own incoming orders)
    async getIncoming(req, res) {
        try {
            const supplier = await Supplier.findByUserId(req.user.userId);
            if (!supplier) return res.status(404).json({ error: 'You need a supplier profile first.' });
            const orders = await ProcurementOrder.findBySupplierId(supplier.supplier_id);
            return res.status(200).json({ count: orders.length, orders });
        } catch (err) {
            console.error('getIncoming procurement orders error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    // GET /api/procurement-orders/:id  (owner farmer, owner supplier, or manager/admin)
    async getById(req, res) {
        try {
            const order = await ProcurementOrder.findById(req.params.id);
            if (!order) return res.status(404).json({ error: 'Order not found.' });

            if (req.user.role === 'farmer') {
                const farmer = await Farmer.findByUserId(req.user.userId);
                if (!farmer || farmer.farmer_id !== order.farmer_id) return res.status(404).json({ error: 'Order not found.' });
            } else if (req.user.role === 'supplier') {
                const supplier = await Supplier.findByUserId(req.user.userId);
                if (!supplier || supplier.supplier_id !== order.supplier_id) return res.status(404).json({ error: 'Order not found.' });
            }
            // cooperative_manager / admin can view any order - no extra check needed

            return res.status(200).json({ order });
        } catch (err) {
            console.error('getById procurement order error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    // PUT /api/procurement-orders/:id/status  (supplier fulfilling their own order, or manager/admin)
    async updateStatus(req, res) {
        try {
            const { status } = req.body;
            if (!VALID_STATUSES.includes(status)) {
                return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
            }

            const order = await ProcurementOrder.findById(req.params.id);
            if (!order) return res.status(404).json({ error: 'Order not found.' });

            if (req.user.role === 'supplier') {
                const supplier = await Supplier.findByUserId(req.user.userId);
                if (!supplier || supplier.supplier_id !== order.supplier_id) return res.status(404).json({ error: 'Order not found.' });
            }

            const updated = await ProcurementOrder.updateStatus(req.params.id, status);
            return res.status(200).json({ message: 'Order status updated.', order: updated });
        } catch (err) {
            console.error('updateStatus procurement order error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    // GET /api/procurement-orders  (manager/admin - all orders)
    async getAll(req, res) {
        try {
            const orders = await ProcurementOrder.findAll();
            return res.status(200).json({ count: orders.length, orders });
        } catch (err) {
            console.error('getAll procurement orders error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },
};

module.exports = procurementOrderController;
