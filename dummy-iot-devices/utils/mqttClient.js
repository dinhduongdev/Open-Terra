/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

const mqtt = require('mqtt');
const config = require('../config');

/**
 * MQTT Client Manager (Singleton)
 * Manages connection to MQTT broker
 */
class MQTTClient {
    constructor() {
        this.client = null;
        this.connected = false;
    }

    /**
     * Connect to MQTT broker
     * @returns {Promise<void>}
     */
    async connect() {
        return new Promise((resolve, reject) => {
            if (this.connected) {
                resolve();
                return;
            }

            console.log(`Connecting to MQTT broker: ${config.mqtt.brokerUrl}`);
            this.client = mqtt.connect(config.mqtt.brokerUrl, config.mqtt.options);

            this.client.on('connect', () => {
                this.connected = true;
                console.log('✓ Connected to MQTT broker');
                resolve();
            });

            this.client.on('error', (error) => {
                console.error('MQTT connection error:', error.message);
                reject(error);
            });

            this.client.on('offline', () => {
                this.connected = false;
                console.log('MQTT client offline');
            });

            this.client.on('reconnect', () => {
                console.log('Reconnecting to MQTT broker...');
            });
        });
    }

    /**
     * Publish message to MQTT topic
     * @param {string} topic - MQTT topic
     * @param {string} message - Message payload
     * @returns {Promise<void>}
     */
    async publish(topic, message) {
        return new Promise((resolve, reject) => {
            if (!this.connected) {
                reject(new Error('MQTT client not connected'));
                return;
            }

            this.client.publish(topic, message, { qos: 0 }, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * Disconnect from MQTT broker
     * @returns {Promise<void>}
     */
    async disconnect() {
        return new Promise((resolve) => {
            if (!this.client) {
                resolve();
                return;
            }

            this.client.end(false, () => {
                this.connected = false;
                console.log('✓ Disconnected from MQTT broker');
                resolve();
            });
        });
    }
}

// Export singleton instance
module.exports = new MQTTClient();
