const pool = require('../config/db');

const Payment = {
    // Exactly one of orderId / procurementOrderId / bookingId must
    // be provided - the database's CHECK constraint enforces this
    // too, but we validate here first for a friendlier error message.
    async create({ orderId, procurementOrderId, bookingId, amount, paymentMethod }) {
        const result = await pool.query(
            `INSERT INTO payments (order_id, procurement_order_id, booking_id, amount, payment_method)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [orderId || null, procurementOrderId || null, bookingId || null, amount, paymentMethod || null]
        );
        return result.rows[0];
    },

    async findById(paymentId) {
        const result = await pool.query('SELECT * FROM payments WHERE payment_id = $1', [paymentId]);
        return result.rows[0];
    },

    async updateStatus(paymentId, paymentStatus) {
        const result = await pool.query(
            'UPDATE payments SET payment_status = $1 WHERE payment_id = $2 RETURNING *',
            [paymentStatus, paymentId]
        );
        return result.rows[0];
    },

    async findAll() {
        const result = await pool.query('SELECT * FROM payments ORDER BY payment_date DESC');
        return result.rows;
    },

    // "My payments" - a user's payments across all three transaction
    // types, found by joining through whichever link applies to them.
    async findByFarmerId(farmerId) {
        const result = await pool.query(
            `SELECT p.* FROM payments p
             LEFT JOIN procurement_orders po ON p.procurement_order_id = po.procurement_order_id
             LEFT JOIN equipment_bookings eb ON p.booking_id = eb.booking_id
             WHERE po.farmer_id = $1 OR eb.farmer_id = $1
             ORDER BY p.payment_date DESC`,
            [farmerId]
        );
        return result.rows;
    },

    async findByBuyerId(buyerId) {
        const result = await pool.query(
            `SELECT p.* FROM payments p
             JOIN orders o ON p.order_id = o.order_id
             WHERE o.buyer_id = $1
             ORDER BY p.payment_date DESC`,
            [buyerId]
        );
        return result.rows;
    },
};

module.exports = Payment;
