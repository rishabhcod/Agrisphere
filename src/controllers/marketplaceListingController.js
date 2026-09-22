const Farmer = require('../models/Farmer');
const MarketplaceListing = require('../models/MarketplaceListing');

const marketplaceListingController = {
    // GET /api/marketplace-listings - anyone logged in browses active listings
    async getActive(req, res) {
        try {
            const listings = await MarketplaceListing.findActive();
            return res.status(200).json({ count: listings.length, listings });
        } catch (err) {
            console.error('getActive listings error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    // POST /api/marketplace-listings - farmer only
    async create(req, res) {
        try {
            const farmer = await Farmer.findByUserId(req.user.userId);
            if (!farmer) return res.status(404).json({ error: 'You need a farmer profile first.' });

            const { cropId, quantityAvailableKg, pricePerKg } = req.body;
            if (!cropId || !quantityAvailableKg || !pricePerKg) {
                return res.status(400).json({ error: 'cropId, quantityAvailableKg, and pricePerKg are required.' });
            }

            const listing = await MarketplaceListing.create({ farmerId: farmer.farmer_id, cropId, quantityAvailableKg, pricePerKg });
            return res.status(201).json({ message: 'Listing created.', listing });
        } catch (err) {
            console.error('create listing error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    // GET /api/marketplace-listings/me - farmer's own listings
    async getMine(req, res) {
        try {
            const farmer = await Farmer.findByUserId(req.user.userId);
            if (!farmer) return res.status(404).json({ error: 'You need a farmer profile first.' });
            const listings = await MarketplaceListing.findByFarmerId(farmer.farmer_id);
            return res.status(200).json({ count: listings.length, listings });
        } catch (err) {
            console.error('getMine listings error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    // PUT /api/marketplace-listings/:id - owner farmer only
    async update(req, res) {
        try {
            const farmer = await Farmer.findByUserId(req.user.userId);
            if (!farmer) return res.status(404).json({ error: 'You need a farmer profile first.' });

            const listing = await MarketplaceListing.findById(req.params.id);
            if (!listing || listing.farmer_id !== farmer.farmer_id) return res.status(404).json({ error: 'Listing not found.' });

            const { quantityAvailableKg, pricePerKg, status } = req.body;
            const updated = await MarketplaceListing.update(req.params.id, { quantityAvailableKg, pricePerKg, status });
            return res.status(200).json({ message: 'Listing updated.', listing: updated });
        } catch (err) {
            console.error('update listing error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    // DELETE /api/marketplace-listings/:id - owner farmer only
    async remove(req, res) {
        try {
            const farmer = await Farmer.findByUserId(req.user.userId);
            if (!farmer) return res.status(404).json({ error: 'You need a farmer profile first.' });

            const listing = await MarketplaceListing.findById(req.params.id);
            if (!listing || listing.farmer_id !== farmer.farmer_id) return res.status(404).json({ error: 'Listing not found.' });

            await MarketplaceListing.delete(req.params.id);
            return res.status(200).json({ message: 'Listing deleted.' });
        } catch (err) {
            console.error('remove listing error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },
};

module.exports = marketplaceListingController;
