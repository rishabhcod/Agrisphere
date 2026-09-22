const CropPlan = require('../models/CropPlan');
const Farmer = require('../models/Farmer');
const LandParcel = require('../models/LandParcel');

async function getOwnFarmerIdOrFail(req, res) {
    const farmer = await Farmer.findByUserId(req.user.userId);
    if (!farmer) {
        res.status(404).json({ error: 'You need a farmer profile before creating crop plans.' });
        return null;
    }
    return farmer.farmer_id;
}

const cropPlanController = {
    // POST /api/crop-plans
    async create(req, res) {
        try {
            const farmerId = await getOwnFarmerIdOrFail(req, res);
            if (!farmerId) return;

            const { landParcelId, cropId, seasonYear, sowingDate, expectedHarvestDate, expectedYieldKg } = req.body;
            if (!landParcelId || !cropId || !seasonYear) {
                return res.status(400).json({ error: 'landParcelId, cropId, and seasonYear are required.' });
            }

            // Ownership check: the land parcel must belong to THIS farmer.
            const parcel = await LandParcel.findById(landParcelId);
            if (!parcel || parcel.farmer_id !== farmerId) {
                return res.status(404).json({ error: 'Land parcel not found.' });
            }

            const plan = await CropPlan.create({ farmerId, landParcelId, cropId, seasonYear, sowingDate, expectedHarvestDate, expectedYieldKg });
            return res.status(201).json({ message: 'Crop plan created.', plan });
        } catch (err) {
            console.error('create crop plan error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    // GET /api/crop-plans/me
    async getMine(req, res) {
        try {
            const farmerId = await getOwnFarmerIdOrFail(req, res);
            if (!farmerId) return;
            const plans = await CropPlan.findByFarmerId(farmerId);
            return res.status(200).json({ count: plans.length, plans });
        } catch (err) {
            console.error('getMine crop plans error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    // PUT /api/crop-plans/:id  (owner farmer updates sowing/yield/status)
    async update(req, res) {
        try {
            const farmerId = await getOwnFarmerIdOrFail(req, res);
            if (!farmerId) return;

            const plan = await CropPlan.findById(req.params.id);
            if (!plan || plan.farmer_id !== farmerId) {
                return res.status(404).json({ error: 'Crop plan not found.' });
            }

            const { sowingDate, expectedHarvestDate, expectedYieldKg, actualYieldKg, status } = req.body;
            const updated = await CropPlan.update(req.params.id, { sowingDate, expectedHarvestDate, expectedYieldKg, actualYieldKg, status });
            return res.status(200).json({ message: 'Crop plan updated.', plan: updated });
        } catch (err) {
            console.error('update crop plan error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    // DELETE /api/crop-plans/:id
    async remove(req, res) {
        try {
            const farmerId = await getOwnFarmerIdOrFail(req, res);
            if (!farmerId) return;

            const plan = await CropPlan.findById(req.params.id);
            if (!plan || plan.farmer_id !== farmerId) {
                return res.status(404).json({ error: 'Crop plan not found.' });
            }

            await CropPlan.delete(req.params.id);
            return res.status(200).json({ message: 'Crop plan deleted.' });
        } catch (err) {
            console.error('remove crop plan error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    // GET /api/crop-plans  (manager/admin - all farmers' plans)
    async getAll(req, res) {
        try {
            const plans = await CropPlan.findAll();
            return res.status(200).json({ count: plans.length, plans });
        } catch (err) {
            console.error('getAll crop plans error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },
};

module.exports = cropPlanController;
