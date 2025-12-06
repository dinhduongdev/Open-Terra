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
 * Flood Monitoring Device
 * Simulates flood level monitoring for flood detection on roads/drains
 * Based on FIWARE Smart Data Model: FloodMonitoring
 * Includes tidal surge simulation (full moon and new moon periods)
 */
class FloodMonitoring extends BaseDevice {
    constructor(config) {
        super(config);
        this.referenceLevel = config.referenceLevel || 2.5; // Vertical distance from river bed to sensor tip (meters)
        this.alertLevel = config.alertLevel || 1.8; // Alert threshold (meters from river bed)
        this.dangerLevel = config.dangerLevel || 1.5; // Danger threshold (meters from river bed)
        this.measuredDistance = this.referenceLevel - 0.08; // Distance from sensor to water surface (starts near bed)
        this.location = config.location || { lat: 10.762622, lon: 106.660172 }; // Default: Ho Chi Minh City
    }

    /**
     * Generate realistic flood monitoring data based on Smart Data Model
     * Includes tidal surge effects on full moon and new moon (±1-2 days)
     * @returns {Object} Flood measurement data
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
            // Tidal surge raises water level (reduces measuredDistance)
            // Peak intensity at rằm (day 15) and mùng 1 (day 1)
            tidalEffect = 0.20 + (intensity * 0.30); // 0.20-0.50m rise
            
            // Add daily tidal variation (2 high tides per day)
            const hourAngle = (hour + now.getMinutes() / 60) / 12 * Math.PI;
            const tidalVariation = Math.sin(hourAngle) * 0.10; // ±0.10m
            tidalEffect += tidalVariation;
        }

        // Simulate water level changes (affects measuredDistance)
        let change = 0;
        
        if (isRaining) {
            // Water rises during rain - measuredDistance decreases (0.02-0.12m per interval)
            change = -(0.02 + Math.random() * 0.10);
        } else {
            // Water recedes when not raining - measuredDistance increases (drainage)
            const drainageRate = 0.01 + Math.random() * 0.02; // 0.01 to 0.03m per interval
            change = drainageRate;
        }
        
        // Update measured distance (from sensor to water surface)
        // Lower measuredDistance = higher water level (water closer to sensor)
        this.measuredDistance = Math.max(
            0.1, // Minimum 0.1m (very high water, near sensor)
            Math.min(this.referenceLevel - 0.05, this.measuredDistance + change)
        );
        
        // Apply tidal effect (reduces measuredDistance = raises water)
        const actualMeasuredDistance = Math.max(0.1, this.measuredDistance - tidalEffect);

        // Calculate current water level from river bed
        // currentLevel = referenceLevel - measuredDistance
        const currentLevel = parseFloat((this.referenceLevel - actualMeasuredDistance).toFixed(2));

        // Current observation timestamp
        const dateObserved = now.toISOString();

        // Determine flood level status based on thresholds
        let floodLevelStatus;
        if (currentLevel < this.dangerLevel) {
            floodLevelStatus = 'Normal'; // Water level is safe
        } else if (currentLevel < this.alertLevel) {
            floodLevelStatus = 'Alert'; // Water level reaching alert threshold
        } else {
            floodLevelStatus = 'Danger'; // Water level is dangerous
        }

        return {
            measuredDistance: parseFloat(actualMeasuredDistance.toFixed(2)),
            currentLevel: currentLevel,
            referenceLevel: this.referenceLevel,
            alertLevel: this.alertLevel,
            dangerLevel: this.dangerLevel,
            floodLevelStatus: floodLevelStatus,
            dateObserved: dateObserved,
            location: `${this.location.lon},${this.location.lat}`, // "lon,lat" format for GeoJSON
            stationID: this.config.deviceId
        };
    }
}

module.exports = FloodMonitoring;
