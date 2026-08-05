// This file has ONE job: open a connection pool to PostgreSQL
// and hand it out to every model that needs to run a query.
// "Pool" means it keeps several connections open and ready,
// instead of opening/closing a new one for every single query
// (which would be slow).

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Quick sanity check when the server starts - if this fails,
// your .env DATABASE_URL is wrong or Postgres isn't running.
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Could not connect to the database:', err.message);
    } else {
        console.log('✅ Connected to PostgreSQL at', res.rows[0].now);
    }
});

module.exports = pool;