const pool = require('../config/db');

const ProcurementOrder = {
    // Creates the order AND its line items together, inside one
    // database transaction - if anything fails partway through,
    // everything rolls back, so we never end up with an order
    // that has zero items or a wrong total.
    async createWithItems({ farmerId, supplierId, items }) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // 1. Look up current prices for each item and compute subtotals + grand total.
            let totalAmount = 0;
            const resolvedItems = [];
            for (const item of items) {
                const priceResult = await client.query(
                    'SELECT unit_price FROM input_items WHERE input_item_id = $1 AND supplier_id = $2',
                    [item.inputItemId, supplierId]
                );
                if (priceResult.rows.length === 0) {
                    throw new Error(`Input item ${item.inputItemId} does not belong to this supplier.`);
                }
                const unitPrice = parseFloat(priceResult.rows[0].unit_price);
                const subtotal = unitPrice * item.quantity;
                totalAmount += subtotal;
                resolvedItems.push({ ...item, unitPrice, subtotal });
            }

            // 2. Create the order header with the computed total.
            const orderResult = await client.query(
                `INSERT INTO procurement_orders (farmer_id, supplier_id, total_amount)
                 VALUES ($1, $2, $3) RETURNING *`,
                [farmerId, supplierId, totalAmount]
            );
            const order = orderResult.rows[0];

            // 3. Insert every line item, linked to that order.
            for (const item of resolvedItems) {
                await client.query(
                    `INSERT INTO procurement_order_items (procurement_order_id, input_item_id, quantity, unit_price, subtotal)
                     VALUES ($1, $2, $3, $4, $5)`,
                    [order.procurement_order_id, item.inputItemId, item.quantity, item.unitPrice, item.subtotal]
                );
            }

            await client.query('COMMIT');
            return { ...order, items: resolvedItems };
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    },

    async findByFarmerId(farmerId) {
        const result = await pool.query(
            `SELECT po.*, s.company_name
             FROM procurement_orders po JOIN suppliers s ON po.supplier_id = s.supplier_id
             WHERE po.farmer_id = $1 ORDER BY po.order_date DESC`,
            [farmerId]
        );
        return result.rows;
    },

    async findBySupplierId(supplierId) {
        const result = await pool.query(
            `SELECT po.* FROM procurement_orders po WHERE po.supplier_id = $1 ORDER BY po.order_date DESC`,
            [supplierId]
        );
        return result.rows;
    },

    async findAll() {
        const result = await pool.query(
            `SELECT po.*, s.company_name FROM procurement_orders po
             JOIN suppliers s ON po.supplier_id = s.supplier_id ORDER BY po.order_date DESC`
        );
        return result.rows;
    },

    async findById(procurementOrderId) {
        const orderResult = await pool.query('SELECT * FROM procurement_orders WHERE procurement_order_id = $1', [procurementOrderId]);
        const order = orderResult.rows[0];
        if (!order) return null;

        const itemsResult = await pool.query(
            `SELECT poi.*, ii.name AS item_name
             FROM procurement_order_items poi JOIN input_items ii ON poi.input_item_id = ii.input_item_id
             WHERE poi.procurement_order_id = $1`,
            [procurementOrderId]
        );
        return { ...order, items: itemsResult.rows };
    },

    async updateStatus(procurementOrderId, status) {
        const result = await pool.query(
            `UPDATE procurement_orders SET status = $1 WHERE procurement_order_id = $2 RETURNING *`,
            [status, procurementOrderId]
        );
        return result.rows[0];
    },
};

module.exports = ProcurementOrder;
