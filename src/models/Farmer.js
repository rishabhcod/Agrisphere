// Model for the "farmers" table. A farmer's profile is created
// AFTER a user has already registered (role = 'farmer') - this
// model links that login to the extra farmer-specific fields.

const pool = require('../config/db');

const Farmer = {
    // A farmer profile is unique per user - one login, one profile.
    async findByUserId(userId) {
        const result = await pool.query(
            `SELECT f.farmer_id, f.user_id, f.cooperative_id, f.id_proof_number, f.address, f.created_at,
                    u.full_name, u.email, u.phone
             FROM farmers f
             JOIN users u ON f.user_id = u.user_id
             WHERE f.user_id = $1`,
            [userId]
        );
        return result.rows[0];
    },

    async findById(farmerId) {
        const result = await pool.query(
            `SELECT f.farmer_id, f.user_id, f.cooperative_id, f.id_proof_number, f.address, f.created_at,
                    u.full_name, u.email, u.phone
             FROM farmers f
             JOIN users u ON f.user_id = u.user_id
             WHERE f.farmer_id = $1`,
            [farmerId]
        );
        return result.rows[0];
    },

    // Used by Cooperative Managers/Admins to see every farmer.
    async findAll() {
        const result = await pool.query(
            `SELECT f.farmer_id, f.user_id, f.cooperative_id, f.id_proof_number, f.address, f.created_at,
                    u.full_name, u.email, u.phone
             FROM farmers f
             JOIN users u ON f.user_id = u.user_id
             ORDER BY f.created_at DESC`
        );
        return result.rows;
    },

    async create({ userId, cooperativeId, idProofNumber, address }) {
        const result = await pool.query(
            `INSERT INTO farmers (user_id, cooperative_id, id_proof_number, address)
             VALUES ($1, $2, $3, $4)
             RETURNING farmer_id, user_id, cooperative_id, id_proof_number, address, created_at`,
            [userId, cooperativeId || null, idProofNumber || null, address || null]
        );
        return result.rows[0];
    },

    async update(farmerId, { cooperativeId, idProofNumber, address }) {
        const result = await pool.query(
            `UPDATE farmers
             SET cooperative_id = COALESCE($1, cooperative_id),
                 id_proof_number = COALESCE($2, id_proof_number),
                 address = COALESCE($3, address)
             WHERE farmer_id = $4
             RETURNING farmer_id, user_id, cooperative_id, id_proof_number, address, created_at`,
            [cooperativeId, idProofNumber, address, farmerId]
        );
        return result.rows[0];
    },
};

module.exports = Farmer;