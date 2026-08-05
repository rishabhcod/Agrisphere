// Use this AFTER authMiddleware on routes that only certain
// roles should access. Example usage in a route file:
//
//   router.post('/', authMiddleware, roleMiddleware('cooperative_manager'), controller.create);
//
// You can also allow multiple roles: roleMiddleware('admin', 'cooperative_manager')

function roleMiddleware(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            // Should never happen if authMiddleware ran first, but guard anyway
            return res.status(401).json({ error: 'Not authenticated.' });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'You do not have permission to do this.' });
        }
        next();
    };
}

module.exports = roleMiddleware;