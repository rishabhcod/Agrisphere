const Farmer = require('../models/Farmer');
const Equipment = require('../models/Equipment');
const EquipmentBooking = require('../models/EquipmentBooking');

const equipmentBookingController = {
    // POST /api/equipment/:equipmentId/bookings  (farmer only)
    async create(req, res) {
        try {
            const farmer = await Farmer.findByUserId(req.user.userId);
            if (!farmer) return res.status(404).json({ error: 'You need a farmer profile first.' });

            const equipment = await Equipment.findById(req.params.equipmentId);
            if (!equipment) return res.status(404).json({ error: 'Equipment not found.' });

            const { startDate, endDate } = req.body;
            if (!startDate || !endDate) return res.status(400).json({ error: 'startDate and endDate are required.' });
            if (new Date(endDate) < new Date(startDate)) {
                return res.status(400).json({ error: 'endDate cannot be before startDate.' });
            }

            // Application-level overlap check (in addition to any DB-level
            // safeguards) so the farmer gets a clear, friendly error instead
            // of a raw database failure.
            const overlaps = await EquipmentBooking.hasOverlap(req.params.equipmentId, startDate, endDate);
            if (overlaps) {
                return res.status(409).json({ error: 'This equipment is already booked for part of that date range.' });
            }

            const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;
            const totalCost = days * parseFloat(equipment.daily_rate);

            const booking = await EquipmentBooking.create({
                equipmentId: req.params.equipmentId,
                farmerId: farmer.farmer_id,
                startDate,
                endDate,
                totalCost,
            });
            return res.status(201).json({ message: 'Booking requested.', booking });
        } catch (err) {
            console.error('create booking error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    // GET /api/bookings/me  (farmer's own bookings)
    async getMine(req, res) {
        try {
            const farmer = await Farmer.findByUserId(req.user.userId);
            if (!farmer) return res.status(404).json({ error: 'You need a farmer profile first.' });
            const bookings = await EquipmentBooking.findByFarmerId(farmer.farmer_id);
            return res.status(200).json({ count: bookings.length, bookings });
        } catch (err) {
            console.error('getMine bookings error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    // GET /api/equipment/:equipmentId/bookings  (owner viewing bookings on their own equipment)
    async getForEquipment(req, res) {
        try {
            const equipment = await Equipment.findById(req.params.equipmentId);
            if (!equipment || equipment.owner_id !== req.user.userId) return res.status(404).json({ error: 'Equipment not found.' });

            const bookings = await EquipmentBooking.findByEquipmentId(req.params.equipmentId);
            return res.status(200).json({ count: bookings.length, bookings });
        } catch (err) {
            console.error('getForEquipment bookings error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },

    // PUT /api/bookings/:id/status  (equipment owner confirms/cancels, or farmer cancels their own)
    async updateStatus(req, res) {
        try {
            const { status } = req.body;
            if (!['confirmed', 'cancelled', 'completed'].includes(status)) {
                return res.status(400).json({ error: 'status must be confirmed, cancelled, or completed.' });
            }

            const booking = await EquipmentBooking.findById(req.params.id);
            if (!booking) return res.status(404).json({ error: 'Booking not found.' });

            if (req.user.role === 'farmer') {
                const farmer = await Farmer.findByUserId(req.user.userId);
                if (!farmer || farmer.farmer_id !== booking.farmer_id || status !== 'cancelled') {
                    return res.status(403).json({ error: 'Farmers may only cancel their own bookings.' });
                }
            } else if (req.user.role === 'equipment_owner') {
                const equipment = await Equipment.findById(booking.equipment_id);
                if (!equipment || equipment.owner_id !== req.user.userId) {
                    return res.status(404).json({ error: 'Booking not found.' });
                }
            }

            const updated = await EquipmentBooking.updateStatus(req.params.id, status);
            return res.status(200).json({ message: 'Booking status updated.', booking: updated });
        } catch (err) {
            console.error('updateStatus booking error:', err);
            return res.status(500).json({ error: 'Something went wrong.' });
        }
    },
};

module.exports = equipmentBookingController;
