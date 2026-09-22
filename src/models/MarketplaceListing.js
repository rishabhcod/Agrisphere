const pool = require('../config/db');

const MarketplaceListing = {
    async findActive() {
        const result = await pool.query(
            `SELECT l.*, c.name AS crop_name
             FROM marketplace_listings l JOIN crops c ON l.crop_id = c.crop_id
             WHERE l.status = 'active'
             ORDER BY l.listing_date DESC`
        );
        return result.rows;
    },

    async findById(listingId) {
        const result = await pool.query(
            `SELECT l.*, c.name AS crop_name
             FROM marketplace_listings l JOIN crops c ON l.crop_id = c.crop_id
             WHERE l.listing_id = $1`,
            [listingId]
        );
        return result.rows[0];
    },

    async findByFarmerId(farmerId) {
        const result = await pool.query(
            `SELECT l.*, c.name AS crop_name
             FROM marketplace_listings l JOIN crops c ON l.crop_id = c.crop_id
             WHERE l.farmer_id = $1 ORDER BY l.listing_date DESC`,
            [farmerId]
        );
        return result.rows;
    },

    async create({ farmerId, cropId, quantityAvailableKg, pricePerKg }) {
        const result = await pool.query(
            `INSERT INTO marketplace_listings (farmer_id, crop_id, quantity_available_kg, price_per_kg)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [farmerId, cropId, quantityAvailableKg, pricePerKg]
        );
        return result.rows[0];
    },

    async update(listingId, { quantityAvailableKg, pricePerKg, status }) {
        const result = await pool.query(
            `UPDATE marketplace_listings
             SET quantity_available_kg = COALESCE($1, quantity_available_kg),
                 price_per_kg = COALESCE($2, price_per_kg),
                 status = COALESCE($3, status)
             WHERE listing_id = $4 RETURNING *`,
            [quantityAvailableKg, pricePerKg, status, listingId]
        );
        return result.rows[0];
    },

    // Used when a buyer purchases - reduce remaining quantity, and
    // auto-close the listing if nothing is left.
    async reduceQuantity(listingId, quantitySold) {
        const result = await pool.query(
            `UPDATE marketplace_listings
             SET quantity_available_kg = quantity_available_kg - $1,
                 status = CASE WHEN quantity_available_kg - $1 <= 0 THEN 'sold_out' ELSE status END
             WHERE listing_id = $2
             RETURNING *`,
            [quantitySold, listingId]
        );
        return result.rows[0];
    },

    async delete(listingId) {
        const result = await pool.query('DELETE FROM marketplace_listings WHERE listing_id = $1 RETURNING listing_id', [listingId]);
        return result.rows[0];
    },
};

module.exports = MarketplaceListing;
