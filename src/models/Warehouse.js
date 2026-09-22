const pool = require('../config/db');

const Warehouse = {
    async findAll() {
        const result = await pool.query('SELECT * FROM warehouses ORDER BY name');
        return result.rows;
    },

    async findById(warehouseId) {
        const result = await pool.query('SELECT * FROM warehouses WHERE warehouse_id = $1', [warehouseId]);
        return result.rows[0];
    },

    async create({ cooperativeId, name, location, totalCapacityKg }) {
        const result = await pool.query(
            `INSERT INTO warehouses (cooperative_id, name, location, total_capacity_kg)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [cooperativeId || null, name, location || null, totalCapacityKg]
        );
        return result.rows[0];
    },

    async update(warehouseId, { name, location, totalCapacityKg }) {
        const result = await pool.query(
            `UPDATE warehouses
             SET name = COALESCE($1, name), location = COALESCE($2, location), total_capacity_kg = COALESCE($3, total_capacity_kg)
             WHERE warehouse_id = $4 RETURNING *`,
            [name, location, totalCapacityKg, warehouseId]
        );
        return result.rows[0];
    },

    async delete(warehouseId) {
        const result = await pool.query('DELETE FROM warehouses WHERE warehouse_id = $1 RETURNING warehouse_id', [warehouseId]);
        return result.rows[0];
    },
};

module.exports = Warehouse;
