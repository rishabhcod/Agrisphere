// This file wires everything together: creates the Express
// app, applies global middleware, and mounts each module's
// routes at its own path. server.js is the only file that
// actually starts it listening.

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());          // allows your React frontend (different port) to call this API
app.use(express.json());  // lets Express read JSON request bodies (req.body)

// Every module's routes get mounted like this - as you build
// more modules, add one line each, e.g.:
// app.use('/api/farmers', farmerRoutes);
app.use('/api/auth', authRoutes);

// Simple health-check route - open this URL in a browser to
// confirm the server is running at all.
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'AgriSphere backend is running.' });
});

module.exports = app;