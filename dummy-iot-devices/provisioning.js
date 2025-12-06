/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

const config = require('./config');
const fetch = require('node-fetch');

/**
 * IoT Agent provisioning configuration
 */
const IOTA_URL = process.env.IOTA_URL || 'http://iot-agent:4041';

/**
 * Get service group configuration
 */
function getServiceGroupConfig() {
    return {
        services: [{
            apikey: config.ultralight.apiKey,
            cbroker: "http://orion:1026",
            entity_type: "Device",
            resource: ""
        }]
    };
}

/**
 * Get device configuration for provisioning
 */
function getDeviceAttributes(deviceType) {
    if (deviceType === 'TrafficFlowObserved') {
        return [
            { object_id: "i", name: "intensity", type: "Integer" },
            { object_id: "s", name: "averageVehicleSpeed", type: "Float" },
            { object_id: "c", name: "congested", type: "Boolean" },
            { object_id: "o", name: "occupancy", type: "Float" },
            { object_id: "l", name: "laneId", type: "Integer" },
            { object_id: "d", name: "dateObserved", type: "DateTime" },
            { object_id: "loc", name: "location", type: "geo:point" }
        ];
    } else if (deviceType === 'FloodMonitoring') {
        return [
            { object_id: "w", name: "waterLevel", type: "Float" },
            { object_id: "f", name: "flow", type: "Float" },
            { object_id: "h", name: "height", type: "Float" },
            { object_id: "d", name: "dateObserved", type: "DateTime" },
            { object_id: "fs", name: "floodStatus", type: "Text" },
            { object_id: "loc", name: "location", type: "geo:point" },
            { object_id: "ts", name: "tidalSurge", type: "Boolean" },
            { object_id: "ld", name: "lunarDay", type: "Integer" }
        ];
    }
    return [];
}

/**
 * Get all traffic devices configuration
 */
function getTrafficDevicesConfig() {
    return config.devices.trafficDevices.map(device => ({
        device_id: device.deviceId,
        entity_name: device.entityName,
        entity_type: device.entityType,
        protocol: "PDI-IoTA-UltraLight",
        transport: "MQTT",
        apikey: config.ultralight.apiKey,
        attributes: getDeviceAttributes(device.entityType)
    }));
}

/**
 * Get all water devices configuration
 */
function getWaterDevicesConfig() {
    return config.devices.waterDevices.map(device => ({
        device_id: device.deviceId,
        entity_name: device.entityName,
        entity_type: device.entityType,
        protocol: "PDI-IoTA-UltraLight",
        transport: "MQTT",
        apikey: config.ultralight.apiKey,
        attributes: getDeviceAttributes(device.entityType)
    }));
}

/**
 * Provision service group to IoT Agent
 */
async function provisionServiceGroup() {
    const url = `${IOTA_URL}/iot/services`;
    const headers = {
        'Content-Type': 'application/json',
        'fiware-service': config.fiware.service,
        'fiware-servicepath': config.fiware.servicePath
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(getServiceGroupConfig())
        });

        if (!response.ok && response.status !== 409) { // 409 = already exists
            const text = await response.text();
            throw new Error(`Failed to provision service group: ${response.status} ${text}`);
        }

        return { success: true, status: response.status };
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            throw new Error('Cannot connect to IoT Agent. Is it running?');
        }
        throw error;
    }
}

/**
 * Provision devices to IoT Agent
 */
async function provisionDevices(deviceType) {
    const url = `${IOTA_URL}/iot/devices`;
    const headers = {
        'Content-Type': 'application/json',
        'fiware-service': config.fiware.service,
        'fiware-servicepath': config.fiware.servicePath
    };

    let devices;
    if (deviceType === 'traffic') {
        devices = getTrafficDevicesConfig();
    } else if (deviceType === 'water') {
        devices = getWaterDevicesConfig();
    } else {
        devices = [...getTrafficDevicesConfig(), ...getWaterDevicesConfig()];
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ devices })
        });

        if (!response.ok && response.status !== 409) { // 409 = already exists
            const text = await response.text();
            throw new Error(`Failed to provision devices: ${response.status} ${text}`);
        }

        return { success: true, status: response.status, count: devices.length };
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            throw new Error('Cannot connect to IoT Agent. Is it running?');
        }
        throw error;
    }
}

/**
 * Check IoT Agent connection
 */
async function checkIoTAgent() {
    try {
        const response = await fetch(`${IOTA_URL}/iot/about`);
        return response.ok;
    } catch (error) {
        return false;
    }
}

/**
 * Get provisioned devices
 */
async function getProvisionedDevices() {
    try {
        const url = `${IOTA_URL}/iot/devices`;
        const headers = {
            'fiware-service': config.fiware.service,
            'fiware-servicepath': config.fiware.servicePath
        };

        const response = await fetch(url, { headers });
        if (!response.ok) {
            return { devices: [], count: 0 };
        }

        const data = await response.json();
        return data;
    } catch (error) {
        return { devices: [], count: 0 };
    }
}

module.exports = {
    IOTA_URL,
    provisionServiceGroup,
    provisionDevices,
    checkIoTAgent,
    getProvisionedDevices,
    getServiceGroupConfig,
    getTrafficDevicesConfig,
    getWaterDevicesConfig
};
