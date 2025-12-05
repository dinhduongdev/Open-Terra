/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

const BaseDevice = require('./BaseDevice');
const { checkTidalSurge } = require('../utils/lunarCalendar');

/**
 * Water Observation Device
 * Simulates water level monitoring for flood detection on roads/drains
 * Based on FIWARE Smart Data Model: WaterObserved
 * Includes tidal surge simulation (full moon and new moon periods)
 */
class WaterObserved extends BaseDevice {
    constructor(config) {
        super(config);
        this.baseWaterLevel = 0.08; // Base water level in meters (normal drainage level)
        this.waterLevel = this.baseWaterLevel;
        this.location = config.location || { lat: 10.762622, lon: 106.660172 }; // Default: Ho Chi Minh City
        this.drainageCapacity = config.drainageCapacity || 0.35; // Drain capacity in meters
    }

    /**
     * Generate realistic water observation data based on Smart Data Model
     * Includes tidal surge effects on full moon and new moon (±1-2 days)
     * @returns {Object} Water measurement data
     */
    generateData() {
        const now = new Date();
        const hour = now.getHours();
        
        // Check for tidal surge period (rằm or mùng 1 ±1-2 days)
        const tidalInfo = checkTidalSurge(now);
        const { isTidalPeriod, intensity, lunarDay } = tidalInfo;

        // Simulate rainfall (higher chance during certain hours)
        const isRainyHour = hour >= 13 && hour <= 18; // Afternoon rain more common
        const rainChance = isRainyHour ? 0.3 : 0.15;
        const isRaining = Math.random() < rainChance;

        // Calculate tidal effect on water level
        let tidalEffect = 0;
        if (isTidalPeriod) {
            // Tidal surge adds 0.20-0.50m to base water level
            // Peak intensity at rằm (day 15) and mùng 1 (day 1)
            tidalEffect = 0.20 + (intensity * 0.30);
            
            // Add daily tidal variation (2 high tides per day)
            const hourAngle = (hour + now.getMinutes() / 60) / 12 * Math.PI;
            const tidalVariation = Math.sin(hourAngle) * 0.10; // ±0.10m
            tidalEffect += tidalVariation;
        }

        // Simulate water level changes
        let change = 0;
        
        if (isRaining) {
            // Water rises during rain (0.02-0.12m per interval)
            change = 0.02 + Math.random() * 0.10;
        } else {
            // Water recedes when not raining (drainage)
            const drainageRate = -0.01 - Math.random() * 0.02; // -0.01 to -0.03m per interval
            change = drainageRate;
        }
        
        // Update water level with tidal effect
        this.waterLevel = Math.max(
            this.baseWaterLevel,
            Math.min(1.2, this.waterLevel + change)
        );
        
        // Add tidal surge to current water level
        const actualWaterLevel = this.waterLevel + tidalEffect;

        // Simulate water flow (m³/s) - higher when water level is high
        // Flow represents water discharge/drainage rate
        const flow = parseFloat((actualWaterLevel * 2.5 + Math.random() * 0.8).toFixed(2));

        // Height: water level reaching alert coasts (in meters)
        const height = parseFloat(actualWaterLevel.toFixed(2));

        // Current observation timestamp
        const dateObserved = now.toISOString();

        // Determine flood severity based on water level thresholds
        // Consider drainage capacity
        let floodStatus;
        const relativeLevel = actualWaterLevel / this.drainageCapacity;
        
        if (relativeLevel < 0.4) {
            floodStatus = 'normal'; // Below 40% capacity
        } else if (relativeLevel < 0.7) {
            floodStatus = 'warning'; // 40-70% capacity
        } else if (relativeLevel < 1.0) {
            floodStatus = 'alert'; // 70-100% capacity - drain filling up
        } else {
            floodStatus = 'danger'; // Over 100% - water overflowing to street
        }

        // Additional info for tidal periods
        const tidalSurgeActive = isTidalPeriod && intensity > 0.3;

        return {
            waterLevel: parseFloat(actualWaterLevel.toFixed(2)),
            flow: flow,
            height: height,
            dateObserved: dateObserved,
            floodStatus: floodStatus,
            location: `${this.location.lon},${this.location.lat}`, // "lon,lat" format for GeoJSON
            tidalSurge: tidalSurgeActive,
            lunarDay: lunarDay
        };
    }
}

module.exports = WaterObserved;
