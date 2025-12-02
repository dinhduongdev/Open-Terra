const mqttClient = require('./utils/mqttClient');
const config = require('./config');
const TrafficFlowObserved = require('./devices/trafficFlowObserved');
const WaterObserved = require("./devices/waterObserved");

// Store device instances
const devices = [];

/**
 * Initialize and start all devices
 */
async function startDevices() {
    try {
        console.log('=== IoT Dummy Devices Simulator ===\n');
        console.log('Simulating multiple sensors across the city');
        console.log('Traffic: Rush hours 6:30-9am, 12-1pm, 5-7pm');
        console.log('Water: Tidal surge on full moon & new moon (±1-2 days)\n');

        // Connect to MQTT broker
        await mqttClient.connect();

        // Initialize all traffic monitoring devices
        console.log('Initializing Traffic Flow Sensors:');
        config.devices.trafficDevices.forEach((deviceConfig, index) => {
            const device = new TrafficFlowObserved(deviceConfig);
            devices.push(device);
            console.log(`  [${index + 1}] ${deviceConfig.deviceId} at (${deviceConfig.location.lat}, ${deviceConfig.location.lon})`);
        });

        // Initialize all water observation devices
        console.log('\nInitializing Water Level Sensors:');
        config.devices.waterDevices.forEach((deviceConfig, index) => {
            const device = new WaterObserved(deviceConfig);
            devices.push(device);
            console.log(`  [${index + 1}] ${deviceConfig.deviceId} at (${deviceConfig.location.lat}, ${deviceConfig.location.lon}) - capacity: ${deviceConfig.drainageCapacity}m`);
        });

        // Start all devices
        console.log('\nStarting all devices...\n');
        devices.forEach(device => device.start());

        console.log(`\n✓ ${devices.length} devices started successfully`);
        console.log('Press Ctrl+C to stop\n');
    } catch (error) {
        console.error('Failed to start devices:', error.message);
        process.exit(1);
    }
}

/**
 * Graceful shutdown handler
 */
async function shutdown() {
    console.log('\n\nShutting down...');

    // Stop all devices
    devices.forEach(device => device.stop());

    // Disconnect from MQTT broker
    await mqttClient.disconnect();

    console.log('✓ Shutdown complete');
    process.exit(0);
}

// Handle shutdown signals
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Start the application
startDevices();
