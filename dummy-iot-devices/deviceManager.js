/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

const mqttClient = require('./utils/mqttClient');
const config = require('./config');
const TrafficFlowObserved = require('./devices/trafficFlowObserved');
const FloodMonitoring = require('./devices/floodMonitoring');

/**
 * Device Manager
 * Manages the lifecycle of all IoT devices
 */
class DeviceManager {
    constructor() {
        this.devices = [];
        this.isConnected = false;
    }

    /**
     * Initialize all devices from configuration
     */
    initializeDevices() {
        console.log('Initializing devices from configuration...\n');

        // Initialize traffic devices
        console.log('Traffic Flow Sensors:');
        config.devices.trafficDevices.forEach((deviceConfig, index) => {
            const device = new TrafficFlowObserved(deviceConfig);
            this.devices.push(device);
            console.log(`  [${index + 1}] ${deviceConfig.deviceId} at (${deviceConfig.location.lat}, ${deviceConfig.location.lon})`);
        });

        // Initialize flood monitoring devices
        console.log('\nFlood Monitoring Sensors:');
        config.devices.waterDevices.forEach((deviceConfig, index) => {
            const device = new FloodMonitoring(deviceConfig);
            this.devices.push(device);
            console.log(`  [${index + 1}] ${deviceConfig.deviceId} at (${deviceConfig.location.lat}, ${deviceConfig.location.lon}) - ref: ${deviceConfig.referenceLevel}m, danger: ${deviceConfig.dangerLevel}m`);
        });

        console.log(`\n✓ ${this.devices.length} devices initialized\n`);
        return this.devices;
    }

    /**
     * Connect to MQTT broker
     */
    async connect() {
        if (this.isConnected) {
            console.log('Already connected to MQTT broker');
            return;
        }

        try {
            await mqttClient.connect();
            this.isConnected = true;
            console.log('✓ Connected to MQTT broker\n');
        } catch (error) {
            throw new Error(`Failed to connect to MQTT broker: ${error.message}`);
        }
    }

    /**
     * Start all devices
     */
    startAll() {
        if (this.devices.length === 0) {
            throw new Error('No devices initialized. Call initializeDevices() first.');
        }

        console.log('Starting all devices...');
        this.devices.forEach(device => device.start());
        console.log(`✓ ${this.devices.length} devices started\n`);
    }

    /**
     * Start specific devices by type
     * @param {string} type - 'traffic' or 'water'
     */
    startByType(type) {
        const filteredDevices = this.devices.filter(device => {
            if (type === 'traffic') {
                return device.config.entityType === 'TrafficFlowObserved';
            } else if (type === 'water') {
                return device.config.entityType === 'FloodMonitoring';
            }
            return false;
        });

        if (filteredDevices.length === 0) {
            console.log(`No ${type} devices found`);
            return;
        }

        console.log(`Starting ${filteredDevices.length} ${type} devices...`);
        filteredDevices.forEach(device => device.start());
        console.log(`✓ ${filteredDevices.length} ${type} devices started\n`);
    }

    /**
     * Start a specific device by ID
     * @param {string} deviceId - Device ID to start
     */
    startById(deviceId) {
        const device = this.devices.find(d => d.config.deviceId === deviceId);
        
        if (!device) {
            throw new Error(`Device ${deviceId} not found`);
        }

        console.log(`Starting device ${deviceId}...`);
        device.start();
        console.log(`✓ Device ${deviceId} started\n`);
    }

    /**
     * Stop all devices
     */
    stopAll() {
        console.log('Stopping all devices...');
        this.devices.forEach(device => device.stop());
        console.log(`✓ ${this.devices.length} devices stopped\n`);
    }

    /**
     * Stop specific devices by type
     * @param {string} type - 'traffic' or 'water'
     */
    stopByType(type) {
        const filteredDevices = this.devices.filter(device => {
            if (type === 'traffic') {
                return device.config.entityType === 'TrafficFlowObserved';
            } else if (type === 'water') {
                return device.config.entityType === 'FloodMonitoring';
            }
            return false;
        });

        if (filteredDevices.length === 0) {
            console.log(`No ${type} devices found`);
            return;
        }

        console.log(`Stopping ${filteredDevices.length} ${type} devices...`);
        filteredDevices.forEach(device => device.stop());
        console.log(`✓ ${filteredDevices.length} ${type} devices stopped\n`);
    }

    /**
     * Stop a specific device by ID
     * @param {string} deviceId - Device ID to stop
     */
    stopById(deviceId) {
        const device = this.devices.find(d => d.config.deviceId === deviceId);
        
        if (!device) {
            throw new Error(`Device ${deviceId} not found`);
        }

        console.log(`Stopping device ${deviceId}...`);
        device.stop();
        console.log(`✓ Device ${deviceId} stopped\n`);
    }

    /**
     * Get all devices
     */
    getDevices() {
        return this.devices;
    }

    /**
     * Get all devices (alias for getDevices)
     */
    getAll() {
        return this.devices;
    }

    /**
     * Get device by ID
     * @param {string} deviceId - Device ID to get
     */
    getById(deviceId) {
        return this.devices.find(d => d.deviceId === deviceId || d.config.deviceId === deviceId);
    }

    /**
     * Get devices by type
     * @param {string} type - 'traffic' or 'water'
     */
    getDevicesByType(type) {
        return this.devices.filter(device => {
            if (type === 'traffic') {
                return device.config.entityType === 'TrafficFlowObserved';
            } else if (type === 'water') {
                return device.config.entityType === 'FloodMonitoring';
            }
            return false;
        });
    }

    /**
     * Get device status
     */
    getStatus() {
        const trafficDevices = this.getDevicesByType('traffic');
        const waterDevices = this.getDevicesByType('water');

        return {
            total: this.devices.length,
            traffic: trafficDevices.length,
            water: waterDevices.length,
            connected: this.isConnected,
            devices: this.devices.map(device => ({
                id: device.config.deviceId,
                type: device.config.entityType,
                running: device.isRunning || false,
                location: device.config.location
            }))
        };
    }

    /**
     * Disconnect from MQTT broker
     */
    async disconnect() {
        if (!this.isConnected) {
            return;
        }

        console.log('Disconnecting from MQTT broker...');
        await mqttClient.disconnect();
        this.isConnected = false;
        console.log('✓ Disconnected from MQTT broker\n');
    }

    /**
     * Graceful shutdown
     */
    async shutdown() {
        console.log('\nShutting down...');
        this.stopAll();
        await this.disconnect();
        console.log('✓ Shutdown complete');
    }
}

module.exports = DeviceManager;
