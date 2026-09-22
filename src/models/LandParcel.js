// Model for "land_parcels" - one farmer can have many parcels,
// which is exactly why this is its own table instead of columns
// on "farmers".

const pool = require('../config/db');

const LandParcel = {
    async findByFarmerId(farmerId) {
        const result = await pool.query(
            `SELECT * FROM land_parcels WHERE farmer_id = $1 ORDER BY created_at DESC`,
            [farmerId]
        );
        return result.rows;
    },

    async findById(landParcelId) {
        const result = await pool.query(
            `SELECT * FROM land_parcels WHERE land_parcel_id = $1`,
            [landParcelId]
        );
        return result.rows[0];
    },

    async create({ farmerId, landSizeAcres, villageLocation, soilType }) {
        const result = await pool.query(
            `INSERT INTO land_parcels (farmer_id, land_size_acres, village_location, soil_type)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [farmerId, landSizeAcres, villageLocation || null, soilType || null]
        );
        return result.rows[0];
    },

    async update(landParcelId, { landSizeAcres, villageLocation, soilType }) {
        const result = await pool.query(
            `UPDATE land_parcels
             SET land_size_acres = COALESCE($1, land_size_acres),
                 village_location = COALESCE($2, village_location),
                 soil_type = COALESCE($3, soil_type)
             WHERE land_parcel_id = $4
             RETURNING *`,
            [landSizeAcres, villageLocation, soilType, landParcelId]
        );
        return result.rows[0];
    },

    async delete(landParcelId) {
        const result = await pool.query(
            `DELETE FROM land_parcels WHERE land_parcel_id = $1 RETURNING land_parcel_id`,
            [landParcelId]
        );
        return result.rows[0]; // undefined if nothing was deleted
    },
};

module.exports = LandParcel;