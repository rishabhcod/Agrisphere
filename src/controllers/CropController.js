const Crop = require('../models/Crop');

const VALID_SEASONS = ['kharif', 'rabi', 'zaid'];

const cropController = {
    // GET /api/crops - anyone logged in can browse the crop catalog
    async getAll(req, res) {
        try {
            const crops = await Crop.findAll();
            return res.status(200).json({ count: crops.length, crops });
        } catch (err) {
            console.error('getAll crops error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    async getById(req, res) {
        try {
            const crop = await Crop.findById(req.params.id);
            if (!crop) return res.status(404).json({ error: 'Crop not found.' });
            return res.status(200).json({ crop });
        } catch (err) {
            console.error('getById crop error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    // POST /api/crops - manager/admin only, since this is reference data
    async create(req, res) {
        try {
            const { name, season, category } = req.body;
            if (!name) return res.status(400).json({ error: 'name is required.' });
            if (season && !VALID_SEASONS.includes(season)) {
                return res.status(400).json({ error: `season must be one of: ${VALID_SEASONS.join(', ')}` });
            }
            const crop = await Crop.create({ name, season, category });
            return res.status(201).json({ message: 'Crop added.', crop });
        } catch (err) {
            console.error('create crop error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    async update(req, res) {
        try {
            const { name, season, category } = req.body;
            const crop = await Crop.update(req.params.id, { name, season, category });
            if (!crop) return res.status(404).json({ error: 'Crop not found.' });
            return res.status(200).json({ message: 'Crop updated.', crop });
        } catch (err) {
            console.error('update crop error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    async remove(req, res) {
        try {
            const deleted = await Crop.delete(req.params.id);
            if (!deleted) return res.status(404).json({ error: 'Crop not found.' });
            return res.status(200).json({ message: 'Crop deleted.' });
        } catch (err) {
            console.error('remove crop error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },
};

module.exports = cropController;
