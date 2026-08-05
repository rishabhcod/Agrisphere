// This is the file you actually run: node src/server.js
// It just imports the configured app and starts it listening.

require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 AgriSphere backend running on http://localhost:${PORT}`);
});