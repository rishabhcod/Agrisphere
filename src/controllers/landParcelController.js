const Farmer = require('../models/Farmer');
const LandParcel = require('../models/LandParcel');

// Small helper: every action here needs to know the CALLER's
// farmer_id (not farmer_id from the URL/body, which a malicious
// user could fake) - so we always look it up from their token.
async function getOwnFarmerIdOrFail(req, res) {
    const farmer = await Farmer.findByUserId(req.user.userId);
    if (!farmer) {
        res.status(404).json({ error: 'You need to create a farmer profile before managing land parcels.' });
        return null;
    }
    return farmer.farmer_id;
}

const landParcelController = {
    // POST /api/farmers/me/land-parcels
    async addLandParcel(req, res) {
        try {
            const farmerId = await getOwnFarmerIdOrFail(req, res);
            if (!farmerId) return;

            const { landSizeAcres, villageLocation, soilType } = req.body;
            if (!landSizeAcres) {
                return res.status(400).json({ error: 'landSizeAcres is required.' });
            }

            const parcel = await LandParcel.create({ farmerId, landSizeAcres, villageLocation, soilType });
            return res.status(201).json({ message: 'Land parcel added.', parcel });
        } catch (err) {
            console.error('addLandParcel error:', err);
            return res.status(500).json({ error: 'Something went wrong adding the land parcel.' });
        }
    },

    // GET /api/farmers/me/land-parcels
    async getMyLandParcels(req, res) {
        try {
            const farmerId = await getOwnFarmerIdOrFail(req, res);
            if (!farmerId) return;

            const parcels = await LandParcel.findByFarmerId(farmerId);
            return res.status(200).json({ count: parcels.length, parcels });
        } catch (err) {
            console.error('getMyLandParcels error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    // PUT /api/farmers/me/land-parcels/:parcelId
    async updateLandParcel(req, res) {
        try {
            const farmerId = await getOwnFarmerIdOrFail(req, res);
            if (!farmerId) return;

            const parcel = await LandParcel.findById(req.params.parcelId);
            if (!parcel || parcel.farmer_id !== farmerId) {
                // Deliberately the SAME error whether it doesn't exist or
                // belongs to someone else - don't reveal which.
                return res.status(404).json({ error: 'Land parcel not found.' });
            }

            const { landSizeAcres, villageLocation, soilType } = req.body;
            const updated = await LandParcel.update(req.params.parcelId, { landSizeAcres, villageLocation, soilType });
            return res.status(200).json({ message: 'Land parcel updated.', parcel: updated });
        } catch (err) {
            console.error('updateLandParcel error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    // DELETE /api/farmers/me/land-parcels/:parcelId
    async deleteLandParcel(req, res) {
        try {
            const farmerId = await getOwnFarmerIdOrFail(req, res);
            if (!farmerId) return;

            const parcel = await LandParcel.findById(req.params.parcelId);
            if (!parcel || parcel.farmer_id !== farmerId) {
                return res.status(404).json({ error: 'Land parcel not found.' });
            }

            await LandParcel.delete(req.params.parcelId);
            return res.status(200).json({ message: 'Land parcel deleted.' });
        } catch (err) {
            console.error('deleteLandParcel error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },
};

module.exports = landParcelController;