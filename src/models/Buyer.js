const pool = require('../config/db');

const Buyer = {
    async findByUserId(userId) {
        const result = await pool.query(
            `SELECT b.*, u.full_name, u.email, u.phone
             FROM buyers b JOIN users u ON b.user_id = u.user_id
             WHERE b.user_id = $1`,
            [userId]
        );
        return result.rows[0];
    },

    async findById(buyerId) {
        const result = await pool.query('SELECT * FROM buyers WHERE buyer_id = $1', [buyerId]);
        return result.rows[0];
    },

    async create({ userId, businessName, address }) {
        const result = await pool.query(
            `INSERT INTO buyers (user_id, business_name, address) VALUES ($1, $2, $3) RETURNING *`,
            [userId, businessName || null, address || null]
        );
        return result.rows[0];
    },

    async update(buyerId, { businessName, address }) {
        const result = await pool.query(
            `UPDATE buyers SET business_name = COALESCE($1, business_name), address = COALESCE($2, address)
             WHERE buyer_id = $3 RETURNING *`,
            [businessName, address, buyerId]
        );
        return result.rows[0];
    },
};

module.exports = Buyer;
