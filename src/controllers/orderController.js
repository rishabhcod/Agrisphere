const Buyer = require('../models/Buyer');
const Farmer = require('../models/Farmer');
const Order = require('../models/Order');

const orderController = {
    // POST /api/orders - buyer only
    async create(req, res) {
        try {
            const buyer = await Buyer.findByUserId(req.user.userId);
            if (!buyer) return res.status(404).json({ error: 'You need a buyer profile first.' });

            const { listingId, quantityOrderedKg } = req.body;
            if (!listingId || !quantityOrderedKg) {
                return res.status(400).json({ error: 'listingId and quantityOrderedKg are required.' });
            }

            const order = await Order.createPurchase({ listingId, buyerId: buyer.buyer_id, quantityOrderedKg });
            return res.status(201).json({ message: 'Order placed.', order });
        } catch (err) {
            console.error('create order error:', err);
            return res.status(400).json({ error: err.message || 'Could not place the order.' });
        }
    },

    // GET /api/orders/me - buyer's own purchase history
    async getMine(req, res) {
        try {
            const buyer = await Buyer.findByUserId(req.user.userId);
            if (!buyer) return res.status(404).json({ error: 'You need a buyer profile first.' });
            const orders = await Order.findByBuyerId(buyer.buyer_id);
            return res.status(200).json({ count: orders.length, orders });
        } catch (err) {
            console.error('getMine orders error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    // GET /api/orders/incoming - farmer viewing orders placed against their listings
    async getIncoming(req, res) {
        try {
            const farmer = await Farmer.findByUserId(req.user.userId);
            if (!farmer) return res.status(404).json({ error: 'You need a farmer profile first.' });
            const orders = await Order.findByFarmerId(farmer.farmer_id);
            return res.status(200).json({ count: orders.length, orders });
        } catch (err) {
            console.error('getIncoming orders error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    // PUT /api/orders/:id/status - farmer (fulfilling) or manager/admin
    async updateStatus(req, res) {
        try {
            const { status } = req.body;
            if (!['confirmed', 'delivered', 'cancelled'].includes(status)) {
                return res.status(400).json({ error: 'status must be confirmed, delivered, or cancelled.' });
            }
            const updated = await Order.updateStatus(req.params.id, status);
            if (!updated) return res.status(404).json({ error: 'Order not found.' });
            return res.status(200).json({ message: 'Order status updated.', order: updated });
        } catch (err) {
            console.error('updateStatus order error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },
};

module.exports = orderController;
