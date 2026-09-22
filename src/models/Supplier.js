const pool = require('../config/db');

const Supplier = {
    async findByUserId(userId) {
        const result = await pool.query(
            `SELECT s.*, u.full_name, u.email, u.phone
             FROM suppliers s JOIN users u ON s.user_id = u.user_id
             WHERE s.user_id = $1`,
            [userId]
        );
        return result.rows[0];
    },

    async findById(supplierId) {
        const result = await pool.query(
            `SELECT s.*, u.full_name, u.email, u.phone
             FROM suppliers s JOIN users u ON s.user_id = u.user_id
             WHERE s.supplier_id = $1`,
            [supplierId]
        );
        return result.rows[0];
    },

    async findAll() {
        const result = await pool.query(
            `SELECT s.*, u.full_name, u.email, u.phone
             FROM suppliers s JOIN users u ON s.user_id = u.user_id
             ORDER BY s.company_name`
        );
        return result.rows;
    },

    async create({ userId, companyName, contactInfo }) {
        const result = await pool.query(
            `INSERT INTO suppliers (user_id, company_name, contact_info) VALUES ($1, $2, $3) RETURNING *`,
            [userId, companyName, contactInfo || null]
        );
        return result.rows[0];
    },

    async update(supplierId, { companyName, contactInfo }) {
        const result = await pool.query(
            `UPDATE suppliers SET company_name = COALESCE($1, company_name), contact_info = COALESCE($2, contact_info)
             WHERE supplier_id = $3 RETURNING *`,
            [companyName, contactInfo, supplierId]
        );
        return result.rows[0];
    },
};

module.exports = Supplier;
