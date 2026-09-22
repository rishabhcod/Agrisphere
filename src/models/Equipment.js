const pool = require('../config/db');

const Equipment = {
    async findAll() {
        const result = await pool.query(
            `SELECT e.*, u.full_name AS owner_name
             FROM equipment e JOIN users u ON e.owner_id = u.user_id
             ORDER BY e.equipment_id DESC`
        );
        return result.rows;
    },

    async findAvailable() {
        const result = await pool.query(
            `SELECT e.*, u.full_name AS owner_name
             FROM equipment e JOIN users u ON e.owner_id = u.user_id
             WHERE e.availability_status = 'available'
             ORDER BY e.equipment_id DESC`
        );
        return result.rows;
    },

    async findById(equipmentId) {
        const result = await pool.query('SELECT * FROM equipment WHERE equipment_id = $1', [equipmentId]);
        return result.rows[0];
    },

    async findByOwnerId(ownerId) {
        const result = await pool.query('SELECT * FROM equipment WHERE owner_id = $1 ORDER BY equipment_id DESC', [ownerId]);
        return result.rows;
    },

    async create({ ownerId, cooperativeId, equipmentType, dailyRate }) {
        const result = await pool.query(
            `INSERT INTO equipment (owner_id, cooperative_id, equipment_type, daily_rate)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [ownerId, cooperativeId || null, equipmentType, dailyRate]
        );
        return result.rows[0];
    },

    async update(equipmentId, { equipmentType, dailyRate, availabilityStatus }) {
        const result = await pool.query(
            `UPDATE equipment
             SET equipment_type = COALESCE($1, equipment_type),
                 daily_rate = COALESCE($2, daily_rate),
                 availability_status = COALESCE($3, availability_status)
             WHERE equipment_id = $4 RETURNING *`,
            [equipmentType, dailyRate, availabilityStatus, equipmentId]
        );
        return result.rows[0];
    },

    async delete(equipmentId) {
        const result = await pool.query('DELETE FROM equipment WHERE equipment_id = $1 RETURNING equipment_id', [equipmentId]);
        return result.rows[0];
    },
};

module.exports = Equipment;
