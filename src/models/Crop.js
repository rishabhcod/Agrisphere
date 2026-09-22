// "crops" is reference/master data - a fixed list every farmer
// picks from (Wheat, Rice, Cotton...). Rarely changes, so writes
// are restricted to managers/admins in the controller layer.

const pool = require('../config/db');

const Crop = {
    async findAll() {
        const result = await pool.query('SELECT * FROM crops ORDER BY name');
        return result.rows;
    },

    async findById(cropId) {
        const result = await pool.query('SELECT * FROM crops WHERE crop_id = $1', [cropId]);
        return result.rows[0];
    },

    async create({ name, season, category }) {
        const result = await pool.query(
            `INSERT INTO crops (name, season, category) VALUES ($1, $2, $3) RETURNING *`,
            [name, season || null, category || null]
        );
        return result.rows[0];
    },

    async update(cropId, { name, season, category }) {
        const result = await pool.query(
            `UPDATE crops
             SET name = COALESCE($1, name), season = COALESCE($2, season), category = COALESCE($3, category)
             WHERE crop_id = $4 RETURNING *`,
            [name, season, category, cropId]
        );
        return result.rows[0];
    },

    async delete(cropId) {
        const result = await pool.query('DELETE FROM crops WHERE crop_id = $1 RETURNING crop_id', [cropId]);
        return result.rows[0];
    },
};

module.exports = Crop;
