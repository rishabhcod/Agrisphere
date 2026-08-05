// A "model" is just a set of functions that know how to talk
// to ONE table. This model knows how to talk to "users".
// It has NO idea what HTTP is - that's the controller's job.

const pool = require('../config/db');

const User = {
    // Find one user by email - used during login, and to check
    // for duplicate emails during registration.
    async findByEmail(email) {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0]; // undefined if no match found
    },

    // Find one user by their ID - used by authMiddleware to
    // attach the logged-in user to each request.
    async findById(userId) {
        const result = await pool.query(
            'SELECT user_id, full_name, email, phone, role, is_active FROM users WHERE user_id = $1',
            [userId]
        );
        return result.rows[0];
    },

    // Create a new user row. Note: passwordHash is the ALREADY
    // hashed password - this model never sees the plain text one.
    async create({ fullName, email, passwordHash, phone, role }) {
        const result = await pool.query(
            `INSERT INTO users (full_name, email, password_hash, phone, role)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING user_id, full_name, email, phone, role, created_at`,
            [fullName, email, passwordHash, phone, role]
        );
        return result.rows[0];
    },
};

module.exports = User;