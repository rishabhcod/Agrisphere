// The Dashboard has no table of its own - it only ever READS from
// tables other modules already own, proving the point made back in
// Step 1: dashboards should reflect live data, not a separate copy.

const pool = require('../config/db');

const Dashboard = {
    async getSummary() {
        const [
            farmerCount,
            activeListings,
            pendingProcurementOrders,
            paymentsThisMonth,
            totalInventoryKg,
            activeBookings,
        ] = await Promise.all([
            pool.query('SELECT COUNT(*) FROM farmers'),
            pool.query(`SELECT COUNT(*) FROM marketplace_listings WHERE status = 'active'`),
            pool.query(`SELECT COUNT(*) FROM procurement_orders WHERE status = 'pending'`),
            pool.query(
                `SELECT COALESCE(SUM(amount), 0) AS total FROM payments
                 WHERE payment_status = 'completed' AND payment_date >= DATE_TRUNC('month', CURRENT_DATE)`
            ),
            pool.query(`SELECT COALESCE(SUM(quantity_kg), 0) AS total FROM inventory_items WHERE status = 'in_storage'`),
            pool.query(`SELECT COUNT(*) FROM equipment_bookings WHERE status = 'confirmed'`),
        ]);

        return {
            totalFarmers: parseInt(farmerCount.rows[0].count, 10),
            activeMarketplaceListings: parseInt(activeListings.rows[0].count, 10),
            pendingProcurementOrders: parseInt(pendingProcurementOrders.rows[0].count, 10),
            paymentsThisMonth: parseFloat(paymentsThisMonth.rows[0].total),
            totalInventoryInStorageKg: parseFloat(totalInventoryKg.rows[0].total),
            activeEquipmentBookings: parseInt(activeBookings.rows[0].count, 10),
        };
    },
};

module.exports = Dashboard;
