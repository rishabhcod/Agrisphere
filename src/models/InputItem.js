const pool = require('../config/db');

const InputItem = {
    async findAll() {
        const result = await pool.query(
            `SELECT ii.*, s.company_name
             FROM input_items ii JOIN suppliers s ON ii.supplier_id = s.supplier_id
             ORDER BY ii.name`
        );
        return result.rows;
    },

    async findById(inputItemId) {
        const result = await pool.query('SELECT * FROM input_items WHERE input_item_id = $1', [inputItemId]);
        return result.rows[0];
    },

    async findBySupplierId(supplierId) {
        const result = await pool.query('SELECT * FROM input_items WHERE supplier_id = $1 ORDER BY name', [supplierId]);
        return result.rows;
    },

    async create({ supplierId, name, category, unit, unitPrice }) {
        const result = await pool.query(
            `INSERT INTO input_items (supplier_id, name, category, unit, unit_price)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [supplierId, name, category || null, unit, unitPrice]
        );
        return result.rows[0];
    },

    async update(inputItemId, { name, category, unit, unitPrice }) {
        const result = await pool.query(
            `UPDATE input_items
             SET name = COALESCE($1, name), category = COALESCE($2, category),
                 unit = COALESCE($3, unit), unit_price = COALESCE($4, unit_price)
             WHERE input_item_id = $5 RETURNING *`,
            [name, category, unit, unitPrice, inputItemId]
        );
        return result.rows[0];
    },

    async delete(inputItemId) {
        const result = await pool.query('DELETE FROM input_items WHERE input_item_id = $1 RETURNING input_item_id', [inputItemId]);
        return result.rows[0];
    },
};

module.exports = InputItem;
