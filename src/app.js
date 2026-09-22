const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const farmerRoutes = require('./routes/farmerRoutes');
const cropRoutes = require('./routes/cropRoutes');
const procurementRoutes = require('./routes/procurementRoutes');
const warehouseRoutes = require('./routes/warehouseRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

app.use(cors());          // allows your React frontend (different port) to call this API
app.use(express.json());  // lets Express read JSON request bodies (req.body)

// Every module's routes mounted here - one line per module.
app.use('/api/auth', authRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api', cropRoutes);         // adds /api/crops and /api/crop-plans
app.use('/api', procurementRoutes);  // adds /api/suppliers, /api/input-items, /api/procurement-orders
app.use('/api', warehouseRoutes);    // adds /api/warehouses and /api/inventory
app.use('/api', equipmentRoutes);    // adds /api/equipment and /api/bookings
app.use('/api', marketplaceRoutes);  // adds /api/buyers, /api/marketplace-listings, /api/orders
app.use('/api/payments', paymentRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Simple health-check route.
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'AgriSphere backend is running.' });
});

module.exports = app;
