const pool = require('../config/db');

const EquipmentBooking = {
    // Checks whether a proposed date range overlaps any EXISTING
    // confirmed/requested booking for this equipment. Standard
    // interval overlap check: two ranges overlap if
    // existing.start <= new.end AND existing.end >= new.start.
    async hasOverlap(equipmentId, startDate, endDate) {
        const result = await pool.query(
            `SELECT 1 FROM equipment_bookings
             WHERE equipment_id = $1
               AND status IN ('requested', 'confirmed')
               AND start_date <= $3
               AND end_date >= $2
             LIMIT 1`,
            [equipmentId, startDate, endDate]
        );
        return result.rows.length > 0;
    },

    async create({ equipmentId, farmerId, startDate, endDate, totalCost }) {
        const result = await pool.query(
            `INSERT INTO equipment_bookings (equipment_id, farmer_id, start_date, end_date, total_cost)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [equipmentId, farmerId, startDate, endDate, totalCost]
        );
        return result.rows[0];
    },

    async findById(bookingId) {
        const result = await pool.query('SELECT * FROM equipment_bookings WHERE booking_id = $1', [bookingId]);
        return result.rows[0];
    },

    async findByFarmerId(farmerId) {
        const result = await pool.query(
            `SELECT eb.*, e.equipment_type
             FROM equipment_bookings eb JOIN equipment e ON eb.equipment_id = e.equipment_id
             WHERE eb.farmer_id = $1 ORDER BY eb.start_date DESC`,
            [farmerId]
        );
        return result.rows;
    },

    async findByEquipmentId(equipmentId) {
        const result = await pool.query(
            'SELECT * FROM equipment_bookings WHERE equipment_id = $1 ORDER BY start_date DESC',
            [equipmentId]
        );
        return result.rows;
    },

    async updateStatus(bookingId, status) {
        const result = await pool.query(
            `UPDATE equipment_bookings SET status = $1 WHERE booking_id = $2 RETURNING *`,
            [status, bookingId]
        );
        return result.rows[0];
    },
};

module.exports = EquipmentBooking;
