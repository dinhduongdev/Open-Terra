/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

const BaseDevice = require('./BaseDevice');

/**
 * Traffic Monitor Device
 * Simulates traffic monitoring sensor measuring vehicle flow and congestion
 * Based on FIWARE Smart Data Model: TrafficFlowObserved
 */
class TrafficFlowObserved extends BaseDevice {
    constructor(config) {
        super(config);
        this.intensity = 0; // Total number of vehicles detected
        this.laneId = config.laneId || 1; // Lane number being monitored
        this.location = config.location || { lat: 10.762622, lon: 106.660172 }; // Default: Ho Chi Minh City
    }

    /**
     * Check if current time is in rush hour
     * @returns {Object} {isRushHour, congestionLevel}
     */
    checkRushHour() {
        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const timeInMinutes = hour * 60 + minute;

        // Morning rush: 6:30 AM - 9:00 AM (390-540 minutes)
        const morningRushStart = 6 * 60 + 30;  // 6:30 AM
        const morningRushEnd = 9 * 60;          // 9:00 AM
        
        // Lunch rush: 12:00 PM - 1:00 PM (720-780 minutes)
        const lunchRushStart = 12 * 60;         // 12:00 PM
        const lunchRushEnd = 13 * 60;           // 1:00 PM
        
        // Evening rush: 5:00 PM - 7:00 PM (1020-1140 minutes)
        const eveningRushStart = 17 * 60;       // 5:00 PM
        const eveningRushEnd = 19 * 60;         // 7:00 PM

        let isRushHour = false;
        let congestionLevel = 0; // 0 = no congestion, 1 = peak congestion

        if (timeInMinutes >= morningRushStart && timeInMinutes <= morningRushEnd) {
            isRushHour = true;
            // Peak congestion around 7:30-8:30 AM
            const peakTime = 8 * 60; // 8:00 AM
            const distanceFromPeak = Math.abs(timeInMinutes - peakTime);
            congestionLevel = Math.max(0.5, 1 - distanceFromPeak / 90); // 0.5-1.0
        } else if (timeInMinutes >= lunchRushStart && timeInMinutes <= lunchRushEnd) {
            isRushHour = true;
            // Moderate congestion during lunch
            congestionLevel = 0.6 + Math.random() * 0.2; // 0.6-0.8
        } else if (timeInMinutes >= eveningRushStart && timeInMinutes <= eveningRushEnd) {
            isRushHour = true;
            // Peak congestion around 5:30-6:30 PM
            const peakTime = 18 * 60; // 6:00 PM
            const distanceFromPeak = Math.abs(timeInMinutes - peakTime);
            congestionLevel = Math.max(0.5, 1 - distanceFromPeak / 90); // 0.5-1.0
        }

        return { isRushHour, congestionLevel };
    }

    /**
     * Generate realistic traffic data based on Smart Data Model
     * @returns {Object} Traffic measurement data
     */
    generateData() {
        const rushHourInfo = this.checkRushHour();
        const { isRushHour, congestionLevel } = rushHourInfo;

        // Simulate vehicle intensity (total count increases over time)
        let increment;
        if (isRushHour) {
            // High traffic during rush hours (10-25 vehicles per interval)
            increment = Math.floor(10 + congestionLevel * 15 + Math.random() * 5);
        } else {
            // Normal traffic (3-12 vehicles per interval)
            increment = Math.floor(3 + Math.random() * 9);
        }
        this.intensity += increment;

        // Simulate average vehicle speed (km/h)
        let averageVehicleSpeed;
        if (isRushHour) {
            // Slower speeds during rush hour based on congestion level
            // High congestion: 15-30 km/h, Moderate: 25-45 km/h
            const baseSpeed = 45 - (congestionLevel * 25); // 45 to 20 km/h
            const variation = Math.random() * 10 - 5; // ±5 km/h
            averageVehicleSpeed = Math.max(15, Math.min(50, baseSpeed + variation));
        } else {
            // Normal speeds (40-70 km/h)
            const baseSpeed = 55;
            const variation = Math.random() * 20 - 10; // ±10 km/h
            averageVehicleSpeed = Math.max(40, Math.min(70, baseSpeed + variation));
        }

        // Determine if traffic is congested
        // Congested if speed < 35 km/h or high congestion level
        const congested = averageVehicleSpeed < 35 || congestionLevel > 0.7;

        // Occupancy: fraction of time a vehicle occupies the lane (0-1)
        let occupancy;
        if (congested) {
            // High occupancy when congested (0.65-0.95)
            occupancy = 0.65 + congestionLevel * 0.3;
        } else if (isRushHour) {
            // Moderate occupancy during rush hour (0.45-0.70)
            occupancy = 0.45 + congestionLevel * 0.25;
        } else {
            // Low occupancy in normal times (0.15-0.45)
            occupancy = 0.15 + Math.random() * 0.3;
        }

        // Current observation timestamp
        const dateObserved = new Date().toISOString();

        return {
            intensity: this.intensity,
            averageVehicleSpeed: parseFloat(averageVehicleSpeed.toFixed(1)),
            congested: congested,
            occupancy: parseFloat(occupancy.toFixed(2)),
            laneId: this.laneId,
            dateObserved: dateObserved,
            location: `${this.location.lon},${this.location.lat}` // "lon,lat" format for GeoJSON
        };
    }
}

module.exports = TrafficFlowObserved;
