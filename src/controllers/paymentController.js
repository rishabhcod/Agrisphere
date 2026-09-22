const Farmer = require('../models/Farmer');
const Buyer = require('../models/Buyer');
const Payment = require('../models/Payment');

const paymentController = {
    // POST /api/payments - record a payment against exactly one transaction type
    async create(req, res) {
        try {
            const { orderId, procurementOrderId, bookingId, amount, paymentMethod } = req.body;

            const linksProvided = [orderId, procurementOrderId, bookingId].filter((v) => v !== undefined && v !== null).length;
            if (linksProvided !== 1) {
                return res.status(400).json({ error: 'Provide exactly one of orderId, procurementOrderId, or bookingId.' });
            }
            if (!amount) {
                return res.status(400).json({ error: 'amount is required.' });
            }

            const payment = await Payment.create({ orderId, procurementOrderId, bookingId, amount, paymentMethod });
            return res.status(201).json({ message: 'Payment recorded.', payment });
        } catch (err) {
            console.error('create payment error:', err);
            // If our own check above somehow passes but the DB's CHECK
            // constraint still rejects it, surface a clear message
            // instead of a raw Postgres error.
            if (err.code === '23514') {
                return res.status(400).json({ error: 'Payment must link to exactly one transaction type.' });
            }
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    // PUT /api/payments/:id/status - mark completed/failed/refunded
    async updateStatus(req, res) {
        try {
            const { paymentStatus } = req.body;
            if (!['pending', 'completed', 'failed', 'refunded'].includes(paymentStatus)) {
                return res.status(400).json({ error: 'Invalid paymentStatus.' });
            }
            const updated = await Payment.updateStatus(req.params.id, paymentStatus);
            if (!updated) return res.status(404).json({ error: 'Payment not found.' });
            return res.status(200).json({ message: 'Payment status updated.', payment: updated });
        } catch (err) {
            console.error('updateStatus payment error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    // GET /api/payments/me - works for farmer OR buyer, whichever role is logged in
    async getMine(req, res) {
        try {
            let payments = [];
            if (req.user.role === 'farmer') {
                const farmer = await Farmer.findByUserId(req.user.userId);
                if (farmer) payments = await Payment.findByFarmerId(farmer.farmer_id);
            } else if (req.user.role === 'buyer') {
                const buyer = await Buyer.findByUserId(req.user.userId);
                if (buyer) payments = await Payment.findByBuyerId(buyer.buyer_id);
            }
            return res.status(200).json({ count: payments.length, payments });
        } catch (err) {
            console.error('getMine payments error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    // GET /api/payments - manager/admin, everything (powers the Dashboard's "total transactions")
    async getAll(req, res) {
        try {
            const payments = await Payment.findAll();
            return res.status(200).json({ count: payments.length, payments });
        } catch (err) {
            console.error('getAll payments error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },
};

module.exports = paymentController;
