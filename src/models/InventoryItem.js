const pool = require('../config/db');

const InventoryItem = {
    async findAll() {
        const result = await pool.query(
            `SELECT i.*, w.name AS warehouse_name, c.name AS crop_name
             FROM inventory_items i
             JOIN warehouses w ON i.warehouse_id = w.warehouse_id
             JOIN crops c ON i.crop_id = c.crop_id
             ORDER BY i.stored_date DESC`
        );
        return result.rows;
    },

    async findByFarmerId(farmerId) {
        const result = await pool.query(
            `SELECT i.*, w.name AS warehouse_name, c.name AS crop_name
             FROM inventory_items i
             JOIN warehouses w ON i.warehouse_id = w.warehouse_id
             JOIN crops c ON i.crop_id = c.crop_id
             WHERE i.farmer_id = $1
             ORDER BY i.stored_date DESC`,
            [farmerId]
        );
        return result.rows;
    },

    async findById(inventoryItemId) {
        const result = await pool.query('SELECT * FROM inventory_items WHERE inventory_item_id = $1', [inventoryItemId]);
        return result.rows[0];
    },

    async create({ warehouseId, cropId, farmerId, quantityKg, expiryEstimateDate }) {
        const result = await pool.query(
            `INSERT INTO inventory_items (warehouse_id, crop_id, farmer_id, quantity_kg, expiry_estimate_date)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [warehouseId, cropId, farmerId || null, quantityKg, expiryEstimateDate || null]
        );
        return result.rows[0];
    },

    async updateStatusOrQuantity(inventoryItemId, { quantityKg, status }) {
        const result = await pool.query(
            `UPDATE inventory_items
             SET quantity_kg = COALESCE($1, quantity_kg), status = COALESCE($2, status)
             WHERE inventory_item_id = $3 RETURNING *`,
            [quantityKg, status, inventoryItemId]
        );
        return result.rows[0];
    },

    async delete(inventoryItemId) {
        const result = await pool.query('DELETE FROM inventory_items WHERE inventory_item_id = $1 RETURNING inventory_item_id', [inventoryItemId]);
        return result.rows[0];
    },
};

module.exports = InventoryItem;
