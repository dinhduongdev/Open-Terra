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
            entity_type: "TrafficFlowObserved",
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
            { object_id: "md", name: "measuredDistance", type: "Float" },
            { object_id: "cl", name: "currentLevel", type: "Float" },
            { object_id: "rl", name: "referenceLevel", type: "Float" },
            { object_id: "al", name: "alertLevel", type: "Float" },
            { object_id: "dl", name: "dangerLevel", type: "Float" },
            { object_id: "fls", name: "floodLevelStatus", type: "Text" },
            { object_id: "d", name: "dateObserved", type: "DateTime" },
            { object_id: "loc", name: "location", type: "geo:point" },
            { object_id: "sid", name: "stationID", type: "Text" }
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
 * Delete service group from IoT Agent
 */
async function deleteServiceGroup() {
    const url = `${IOTA_URL}/iot/services?resource=&apikey=${config.ultralight.apiKey}`;
    const headers = {
        'fiware-service': config.fiware.service,
        'fiware-servicepath': config.fiware.servicePath
    };

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: headers
        });

        if (!response.ok && response.status !== 404) { // 404 = not found
            const text = await response.text();
            throw new Error(`Failed to delete service group: ${response.status} ${text}`);
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
 * Provision service group to IoT Agent
 * If service group exists, delete and recreate it
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
        
        if (response.status === 409) { // 409 = already exists
            console.log('  Service group exists, deleting and recreating...');
            await deleteServiceGroup();
            
            // Wait 2 seconds before recreating
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Recreate service group
            const recreateResponse = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(getServiceGroupConfig())
            });
            
            if (!recreateResponse.ok) {
                const text = await recreateResponse.text();
                throw new Error(`Failed to recreate service group: ${recreateResponse.status} ${text}`);
            }
            
            return { success: true, status: recreateResponse.status, recreated: true };
        }
        
        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Failed to provision service group: ${response.status} ${text}`);
        }

        return { success: true, status: response.status, recreated: false };
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            throw new Error('Cannot connect to IoT Agent. Is it running?');
        }
        throw error;
    }
}

/**
 * Provision devices to IoT Agent
 * Provisions devices ONE BY ONE with delay to ensure temporal subscriptions are properly set up
 */
async function provisionDevices(deviceType) {
    const url = `${IOTA_URL}/iot/devices`;
    const headers = {
        'Content-Type': 'application/json',
        'fiware-service': config.fiware.service,
        'fiware-servicepath': config.fiware.servicePath
    };

    let deviceConfigs;
    if (deviceType === 'traffic') {
        deviceConfigs = getTrafficDevicesConfig();
    } else if (deviceType === 'water') {
        deviceConfigs = getWaterDevicesConfig();
    } else {
        deviceConfigs = [...getTrafficDevicesConfig(), ...getWaterDevicesConfig()];
    }

    // Provision devices one by one with delay to avoid race conditions
    // This ensures each device's temporal subscription is properly initialized
    let successCount = 0;
    let alreadyExistsCount = 0;

    for (const device of deviceConfigs) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ devices: [device] })
            });

            if (response.ok) {
                successCount++;
                console.log(`  ✓ Provisioned: ${device.device_id}`);
                // Wait 5 seconds between each device to allow temporal subscription setup
                await new Promise(resolve => setTimeout(resolve, 5000));
            } else if (response.status === 409) {
                alreadyExistsCount++;
                console.log(`  ⊙ Already exists: ${device.device_id}`);
            } else {
                const text = await response.text();
                console.error(`  ✗ Failed to provision ${device.device_id}: ${response.status} ${text}`);
            }
        } catch (error) {
            if (error.code === 'ECONNREFUSED') {
                throw new Error('Cannot connect to IoT Agent. Is it running?');
            }
            console.error(`  ✗ Error provisioning ${device.device_id}: ${error.message}`);
        }
    }

    const totalCount = deviceConfigs.length;
    const status = alreadyExistsCount === totalCount ? 409 : 201;

    return { 
        success: true, 
        status: status, 
        count: totalCount,
        provisioned: successCount,
        alreadyExists: alreadyExistsCount
    };
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

/**
 * Delete a single device from IoT Agent
 */
async function deleteDevice(deviceId) {
    const url = `${IOTA_URL}/iot/devices/${deviceId}`;
    const headers = {
        'fiware-service': config.fiware.service,
        'fiware-servicepath': config.fiware.servicePath
    };

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: headers
        });

        if (!response.ok && response.status !== 404) { // 404 = not found
            const text = await response.text();
            throw new Error(`Failed to delete device: ${response.status} ${text}`);
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
 * Delete devices from IoT Agent
 */
async function deleteDevices(deviceType) {
    let deviceConfigs;
    if (deviceType === 'traffic') {
        deviceConfigs = getTrafficDevicesConfig();
    } else if (deviceType === 'water') {
        deviceConfigs = getWaterDevicesConfig();
    } else {
        deviceConfigs = [...getTrafficDevicesConfig(), ...getWaterDevicesConfig()];
    }

    let successCount = 0;
    let notFoundCount = 0;

    for (const device of deviceConfigs) {
        try {
            const result = await deleteDevice(device.device_id);
            if (result.status === 204 || result.status === 200) {
                successCount++;
                console.log(`  ✓ Deleted: ${device.device_id}`);
            } else if (result.status === 404) {
                notFoundCount++;
                console.log(`  ⊙ Not found: ${device.device_id}`);
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error(`  ✗ Error deleting ${device.device_id}: ${error.message}`);
        }
    }

    const totalCount = deviceConfigs.length;
    return {
        success: true,
        count: totalCount,
        deleted: successCount,
        notFound: notFoundCount
    };
}

/**
 * Re-provision devices (delete and provision again)
 * Useful for resetting devices or updating configurations
 */
async function reprovisionDevices(deviceType) {
    console.log('\n🗑️  Deleting existing devices...');
    const deleteResult = await deleteDevices(deviceType);
    console.log(`   Deleted: ${deleteResult.deleted}, Not found: ${deleteResult.notFound}`);

    // Wait 10 seconds before reprovisioning to ensure cleanup
    console.log('\n⏳ Waiting 10 seconds before reprovisioning...');
    await new Promise(resolve => setTimeout(resolve, 10000));

    console.log('\n📝 Provisioning devices...');
    const provisionResult = await provisionDevices(deviceType);
    console.log(`   Provisioned: ${provisionResult.provisioned}, Already exists: ${provisionResult.alreadyExists}`);

    return {
        success: true,
        deleted: deleteResult.deleted,
        provisioned: provisionResult.provisioned
    };
}

module.exports = {
    IOTA_URL,
    provisionServiceGroup,
    provisionDevices,
    checkIoTAgent,
    getProvisionedDevices,
    getServiceGroupConfig,
    getTrafficDevicesConfig,
    getWaterDevicesConfig,
    deleteDevice,
    deleteDevices,
    deleteServiceGroup,
    reprovisionDevices
};
