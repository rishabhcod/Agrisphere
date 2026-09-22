const pool = require('../config/db');

const Order = {
    // Wrapped in a transaction with a row lock (FOR UPDATE) on the
    // listing, so two buyers can't both "successfully" buy the last
    // of the same stock at the same instant (a race condition).
    async createPurchase({ listingId, buyerId, quantityOrderedKg }) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const listingResult = await client.query(
                'SELECT * FROM marketplace_listings WHERE listing_id = $1 FOR UPDATE',
                [listingId]
            );
            const listing = listingResult.rows[0];
            if (!listing) throw new Error('Listing not found.');
            if (listing.status !== 'active') throw new Error('This listing is no longer active.');
            if (parseFloat(listing.quantity_available_kg) < quantityOrderedKg) {
                throw new Error('Not enough quantity available in this listing.');
            }

            const totalAmount = quantityOrderedKg * parseFloat(listing.price_per_kg);

            const orderResult = await client.query(
                `INSERT INTO orders (listing_id, buyer_id, quantity_ordered_kg, total_amount)
                 VALUES ($1, $2, $3, $4) RETURNING *`,
                [listingId, buyerId, quantityOrderedKg, totalAmount]
            );

            const newQuantity = parseFloat(listing.quantity_available_kg) - quantityOrderedKg;
            await client.query(
                `UPDATE marketplace_listings
                 SET quantity_available_kg = $1, status = CASE WHEN $1 <= 0 THEN 'sold_out' ELSE status END
                 WHERE listing_id = $2`,
                [newQuantity, listingId]
            );

            await client.query('COMMIT');
            return orderResult.rows[0];
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    },

    async findByBuyerId(buyerId) {
        const result = await pool.query(
            `SELECT o.*, l.crop_id FROM orders o JOIN marketplace_listings l ON o.listing_id = l.listing_id
             WHERE o.buyer_id = $1 ORDER BY o.order_date DESC`,
            [buyerId]
        );
        return result.rows;
    },

    // Orders placed against listings belonging to a specific farmer.
    async findByFarmerId(farmerId) {
        const result = await pool.query(
            `SELECT o.* FROM orders o
             JOIN marketplace_listings l ON o.listing_id = l.listing_id
             WHERE l.farmer_id = $1 ORDER BY o.order_date DESC`,
            [farmerId]
        );
        return result.rows;
    },

    async findById(orderId) {
        const result = await pool.query('SELECT * FROM orders WHERE order_id = $1', [orderId]);
        return result.rows[0];
    },

    async updateStatus(orderId, status) {
        const result = await pool.query('UPDATE orders SET status = $1 WHERE order_id = $2 RETURNING *', [status, orderId]);
        return result.rows[0];
    },
};

module.exports = Order;
