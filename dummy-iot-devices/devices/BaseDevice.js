const mqttClient = require('../utils/mqttClient');
const ultralightEncoder = require('../utils/ultralightEncoder');
const config = require('../config');

/**
 * Base Device Class
 * Abstract class for all IoT devices
 */
class BaseDevice {
    /**
     * @param {Object} deviceConfig - Device configuration
     * @param {string} deviceConfig.deviceId - Device ID
     * @param {string} deviceConfig.entityName - NGSI-LD entity name
     * @param {string} deviceConfig.entityType - Entity type
     * @param {Object} deviceConfig.attributes - Attribute mappings (name -> object_id)
     * @param {number} deviceConfig.interval - Measurement interval in ms
     */
    constructor(deviceConfig) {
        this.deviceId = deviceConfig.deviceId;
        this.entityName = deviceConfig.entityName;
        this.entityType = deviceConfig.entityType;
        this.attributes = deviceConfig.attributes;
        this.interval = deviceConfig.interval;
        this.intervalId = null;
    }

    /**
     * Get MQTT topic for measurements
     * Format: /<protocol>/<api-key>/<device-id>/attrs
     * @returns {string}
     */
    getTopic() {
        const { protocol, apiKey } = config.ultralight;
        return `/${protocol}/${apiKey}/${this.deviceId}/attrs`;
    }

    /**
     * Send measurement to IoT Agent via MQTT
     * @param {Object} data - Measurement data (attribute names as keys)
     */
    async sendMeasurement(data) {
        // Map attribute names to object IDs
        const mappedData = {};
        for (const [attrName, value] of Object.entries(data)) {
            const objectId = this.attributes[attrName];
            if (objectId) {
                mappedData[objectId] = value;
            }
        }

        // Encode to UltraLight format
        const message = ultralightEncoder.encode(mappedData);
        const topic = this.getTopic();

        try {
            await mqttClient.publish(topic, message);
            console.log(`[${this.deviceId}] Published: ${message}`);
        } catch (error) {
            console.error(`[${this.deviceId}] Publish error:`, error.message);
        }
    }

    /**
     * Generate measurement data
     * Must be implemented by subclasses
     * @returns {Object} Measurement data
     */
    generateData() {
        throw new Error('generateData() must be implemented by subclass');
    }

    /**
     * Start sending periodic measurements
     */
    start() {
        // Don't start if already running
        if (this.intervalId) {
            console.log(`[${this.deviceId}] Already running`);
            return;
        }

        console.log(`[${this.deviceId}] Starting device (interval: ${this.interval}ms)`);

        // Send first measurement immediately
        const data = this.generateData();
        this.sendMeasurement(data);

        // Schedule periodic measurements
        this.intervalId = setInterval(() => {
            const data = this.generateData();
            this.sendMeasurement(data);
        }, this.interval);
    }

    /**
     * Stop sending measurements
     */
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            console.log(`[${this.deviceId}] Stopped device`);
        }
    }
}

module.exports = BaseDevice;
