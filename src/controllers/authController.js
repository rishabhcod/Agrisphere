// This is the "business logic" layer. It receives an HTTP
// request (req) and sends back an HTTP response (res). It
// calls the User model to actually touch the database.

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const VALID_ROLES = [
    'farmer',
    'cooperative_manager',
    'equipment_owner',
    'logistics_partner',
    'buyer',
    'supplier',
    'admin',
];

const authController = {
    // POST /api/auth/register
    async register(req, res) {
        try {
            const { fullName, email, password, phone, role } = req.body;

            // ---- basic validation (naive-friendly, expand later) ----
            if (!fullName || !email || !password || !role) {
                return res.status(400).json({
                    error: 'fullName, email, password, and role are all required.',
                });
            }
            if (!VALID_ROLES.includes(role)) {
                return res.status(400).json({
                    error: `role must be one of: ${VALID_ROLES.join(', ')}`,
                });
            }

            const existing = await User.findByEmail(email);
            if (existing) {
                return res.status(409).json({ error: 'An account with this email already exists.' });
            }

            // Never store the plain password - hash it first.
            // "10" is the salt rounds - 10 is a normal, safe default.
            const passwordHash = await bcrypt.hash(password, 10);

            const newUser = await User.create({ fullName, email, passwordHash, phone, role });

            return res.status(201).json({
                message: 'User registered successfully.',
                user: newUser,
            });
        } catch (err) {
            console.error('Register error:', err);
            return res.status(500).json({ error: 'Something went wrong during registration.' });
        }
    },

    // POST /api/auth/login
    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'email and password are required.' });
            }

            const user = await User.findByEmail(email);
            if (!user) {
                // Deliberately vague - don't reveal whether the email exists
                return res.status(401).json({ error: 'Invalid email or password.' });
            }

            const passwordMatches = await bcrypt.compare(password, user.password_hash);
            if (!passwordMatches) {
                return res.status(401).json({ error: 'Invalid email or password.' });
            }

            if (!user.is_active) {
                return res.status(403).json({ error: 'This account has been disabled.' });
            }

            // Sign a token containing just enough info to identify
            // the user on future requests. Expires in 7 days.
            const token = jwt.sign(
                { userId: user.user_id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            return res.status(200).json({
                message: 'Login successful.',
                token,
                user: {
                    userId: user.user_id,
                    fullName: user.full_name,
                    email: user.email,
                    role: user.role,
                },
            });
        } catch (err) {
            console.error('Login error:', err);
            return res.status(500).json({ error: 'Something went wrong during login.' });
        }
    },

    // GET /api/auth/me  (protected - relies on authMiddleware)
    async getCurrentUser(req, res) {
        try {
            const user = await User.findById(req.user.userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found.' });
            }
            return res.status(200).json({ user });
        } catch (err) {
            console.error('getCurrentUser error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },
};

module.exports = authController;