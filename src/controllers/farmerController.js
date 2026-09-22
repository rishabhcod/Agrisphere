const Farmer = require('../models/Farmer');

const farmerController = {
    // POST /api/farmers/profile
    // A logged-in user with role 'farmer' creates their extra profile
    // details. Registration (in Auth) only created the LOGIN - this
    // is the second step that adds farmer-specific fields.
    async createProfile(req, res) {
        try {
            if (req.user.role !== 'farmer') {
                return res.status(403).json({ error: 'Only farmer accounts can create a farmer profile.' });
            }

            const existing = await Farmer.findByUserId(req.user.userId);
            if (existing) {
                return res.status(409).json({ error: 'A farmer profile already exists for this account.' });
            }

            const { cooperativeId, idProofNumber, address } = req.body;
            const farmer = await Farmer.create({
                userId: req.user.userId,
                cooperativeId,
                idProofNumber,
                address,
            });

            return res.status(201).json({ message: 'Farmer profile created.', farmer });
        } catch (err) {
            console.error('createProfile error:', err);
            return res.status(500).json({ error: 'Something went wrong creating the farmer profile.' });
        }
    },

    // GET /api/farmers/me
    // The logged-in farmer views their own profile.
    async getMyProfile(req, res) {
        try {
            const farmer = await Farmer.findByUserId(req.user.userId);
            if (!farmer) {
                return res.status(404).json({ error: 'No farmer profile found for this account yet.' });
            }
            return res.status(200).json({ farmer });
        } catch (err) {
            console.error('getMyProfile error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    // PUT /api/farmers/me
    // The logged-in farmer updates their own profile.
    async updateMyProfile(req, res) {
        try {
            const farmer = await Farmer.findByUserId(req.user.userId);
            if (!farmer) {
                return res.status(404).json({ error: 'No farmer profile found for this account yet.' });
            }

            const { cooperativeId, idProofNumber, address } = req.body;
            const updated = await Farmer.update(farmer.farmer_id, { cooperativeId, idProofNumber, address });

            return res.status(200).json({ message: 'Profile updated.', farmer: updated });
        } catch (err) {
            console.error('updateMyProfile error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    // GET /api/farmers
    // Cooperative Manager / Admin only - list every farmer.
    async getAllFarmers(req, res) {
        try {
            const farmers = await Farmer.findAll();
            return res.status(200).json({ count: farmers.length, farmers });
        } catch (err) {
            console.error('getAllFarmers error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    // GET /api/farmers/:id
    // Cooperative Manager / Admin only - view one specific farmer.
    async getFarmerById(req, res) {
        try {
            const farmer = await Farmer.findById(req.params.id);
            if (!farmer) {
                return res.status(404).json({ error: 'Farmer not found.' });
            }
            return res.status(200).json({ farmer });
        } catch (err) {
            console.error('getFarmerById error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },
};

module.exports = farmerController;