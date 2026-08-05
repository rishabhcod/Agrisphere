// This function sits IN FRONT OF protected routes. It checks
// for a valid JWT token in the request header, and if valid,
// attaches the user's info to req.user so controllers can use it.
// If invalid or missing, it stops the request right here.

const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization; // expected format: "Bearer <token>"

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided. Please log in.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { userId, role } - now available in every controller after this
        next(); // token is valid - let the request continue to the actual route
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token. Please log in again.' });
    }
}

module.exports = authMiddleware;