
const pool = require('../config/db');

const CropPlan = {
    async findByFarmerId(farmerId) {
        const result = await pool.query(
            `SELECT cp.*, c.name AS crop_name, lp.village_location
             FROM crop_plans cp
             JOIN crops c ON cp.crop_id = c.crop_id
             JOIN land_parcels lp ON cp.land_parcel_id = lp.land_parcel_id
             WHERE cp.farmer_id = $1
             ORDER BY cp.created_at DESC`,
            [farmerId]
        );
        return result.rows;
    },

    async findById(cropPlanId) {
        const result = await pool.query(
            `SELECT cp.*, c.name AS crop_name
             FROM crop_plans cp
             JOIN crops c ON cp.crop_id = c.crop_id
             WHERE cp.crop_plan_id = $1`,
            [cropPlanId]
        );
        return result.rows[0];
    },

    async findAll() {
        const result = await pool.query(
            `SELECT cp.*, c.name AS crop_name
             FROM crop_plans cp
             JOIN crops c ON cp.crop_id = c.crop_id
             ORDER BY cp.created_at DESC`
        );
        return result.rows;
    },

    async create({ farmerId, landParcelId, cropId, seasonYear, sowingDate, expectedHarvestDate, expectedYieldKg }) {
        const result = await pool.query(
            `INSERT INTO crop_plans (farmer_id, land_parcel_id, crop_id, season_year, sowing_date, expected_harvest_date, expected_yield_kg)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [farmerId, landParcelId, cropId, seasonYear, sowingDate || null, expectedHarvestDate || null, expectedYieldKg || null]
        );
        return result.rows[0];
    },

    async update(cropPlanId, { sowingDate, expectedHarvestDate, expectedYieldKg, actualYieldKg, status }) {
        const result = await pool.query(
            `UPDATE crop_plans
             SET sowing_date = COALESCE($1, sowing_date),
                 expected_harvest_date = COALESCE($2, expected_harvest_date),
                 expected_yield_kg = COALESCE($3, expected_yield_kg),
                 actual_yield_kg = COALESCE($4, actual_yield_kg),
                 status = COALESCE($5, status)
             WHERE crop_plan_id = $6
             RETURNING *`,
            [sowingDate, expectedHarvestDate, expectedYieldKg, actualYieldKg, status, cropPlanId]
        );
        return result.rows[0];
    },

    async delete(cropPlanId) {
        const result = await pool.query('DELETE FROM crop_plans WHERE crop_plan_id = $1 RETURNING crop_plan_id', [cropPlanId]);
        return result.rows[0];
    },
};

module.exports = CropPlan;
