#!/usr/bin/env node
/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */


const DeviceManager = require('./deviceManager');
const provisioning = require('./provisioning');
const config = require('./config');

/**
 * CLI for managing IoT devices in headless mode
 */

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];

// Create device manager instance
const deviceManager = new DeviceManager();

/**
 * Display help information
 */
function showHelp() {
    console.log(`
╔═══════════════════════════════════════════════════════════════╗
║           IoT Dummy Devices - Headless CLI Mode              ║
╚═══════════════════════════════════════════════════════════════╝

USAGE:
  node cli.js <command> [options]

COMMANDS:
  auto                Auto mode: provision and start all devices automatically
  
  provision [type]    Provision devices with IoT Agent
                      type: traffic, water, or all (default: all)
  
  start [options]     Start devices
                      --all           Start all devices (default)
                      --traffic       Start only traffic devices
                      --water         Start only water devices
                      --device=<id>   Start specific device by ID
  
  stop [options]      Stop running devices (use Ctrl+C when devices are running)
  
  list [type]         List configured devices
                      type: traffic, water, or all (default: all)
  
  status              Show device and connection status
  
  config              Display current configuration
  
  help                Show this help message

EXAMPLES:
  # Auto mode - provision and start all devices
  node cli.js auto
  npm run auto

  # Provision all devices
  node cli.js provision

  # Provision only traffic devices
  node cli.js provision traffic

  # Start all devices
  node cli.js start
  npm start

  # Start only water devices
  node cli.js start --water

  # Start specific device
  node cli.js start --device=traffic001

  # List all devices
  node cli.js list
  npm run list

  # Show status
  node cli.js status
  npm run status

ENVIRONMENT:
  MQTT_BROKER_URL     MQTT broker URL (default: mqtt://localhost:1883)
  IOTA_URL            IoT Agent URL (default: http://localhost:4041)
  FIWARE_SERVICE      FIWARE service name (default: openiot)
  FIWARE_SERVICEPATH  FIWARE service path (default: /)

For more information, visit: https://github.com/dinhduongdev/Open-Terra
`);
}

/**
 * Parse command options
 */
function parseOptions(args) {
    const options = {
        all: false,
        traffic: false,
        water: false,
        device: null
    };

    args.forEach(arg => {
        if (arg === '--all') options.all = true;
        else if (arg === '--traffic') options.traffic = true;
        else if (arg === '--water') options.water = true;
        else if (arg.startsWith('--device=')) {
            options.device = arg.split('=')[1];
        }
    });

    // Default to all if no specific option
    if (!options.traffic && !options.water && !options.device) {
        options.all = true;
    }

    return options;
}

/**
 * Auto mode - provision and start all devices
 */
async function autoCommand() {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('  Auto Mode - Provision & Start Devices');
    console.log('═══════════════════════════════════════════════════════════════\n');

    try {
        // Step 1: Provision
        console.log('[1/2] Provisioning devices...\n');
        
        // Check IoT Agent connection
        console.log('Checking IoT Agent connection...');
        const isConnected = await provisioning.checkIoTAgent();

        if (!isConnected) {
            console.error('✗ Cannot connect to IoT Agent');
            console.error(`  Make sure IoT Agent is running at: ${provisioning.IOTA_URL}`);
            process.exit(1);
        }
        console.log('✓ IoT Agent is reachable\n');

        // Provision service group
        console.log('Provisioning service group...');
        const serviceResult = await provisioning.provisionServiceGroup();
        if (serviceResult.status === 409) {
            console.log('  Service group already exists (skipped)');
        } else {
            console.log('✓ Service group provisioned');
        }

        // Provision devices
        console.log('\nProvisioning devices...');
        const deviceResult = await provisioning.provisionDevices('all');
        if (deviceResult.status === 409) {
            console.log(`  ${deviceResult.count} devices already exist (skipped)`);
        } else {
            console.log(`✓ ${deviceResult.count} devices provisioned`);
        }

        console.log('\n✓ Provisioning complete!\n');

        // Step 2: Start devices
        console.log('[2/2] Starting all devices...\n');
        console.log('Simulating multiple sensors across the city');
        console.log('Traffic: Rush hours 6:30-9am, 12-1pm, 5-7pm');
        console.log('Water: Tidal surge on full moon & new moon (±1-2 days)\n');

        // Initialize devices
        deviceManager.initializeDevices();

        // Connect to MQTT
        await deviceManager.connect();

        // Start all devices
        deviceManager.startAll();

        console.log('✓ Auto mode complete - all devices running!\n');
        console.log('Press Ctrl+C to stop\n');

        // Keep process running
        process.stdin.resume();

    } catch (error) {
        console.error('\n✗ Auto mode failed:', error.message);
        process.exit(1);
    }
}

/**
 * Provision devices with IoT Agent
 */
async function provisionCommand(type = 'all') {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('  IoT Device Provisioning');
    console.log('═══════════════════════════════════════════════════════════════\n');

    try {
        // Check IoT Agent connection
        console.log('Checking IoT Agent connection...');
        const isConnected = await provisioning.checkIoTAgent();

        if (!isConnected) {
            console.error('✗ Cannot connect to IoT Agent');
            console.error(`  Make sure IoT Agent is running at: ${provisioning.IOTA_URL}`);
            process.exit(1);
        }
        console.log('✓ IoT Agent is reachable\n');

        // Provision service group
        console.log('Provisioning service group...');
        const serviceResult = await provisioning.provisionServiceGroup();
        if (serviceResult.status === 409) {
            console.log('  Service group already exists (skipped)');
        } else {
            console.log('✓ Service group provisioned');
        }

        // Provision devices
        console.log('\nProvisioning devices...');
        const deviceResult = await provisioning.provisionDevices(type);
        if (deviceResult.status === 409) {
            console.log(`  ${deviceResult.count} devices already exist (skipped)`);
        } else {
            console.log(`✓ ${deviceResult.count} devices provisioned`);
        }

        console.log('\n✓ Provisioning complete!\n');
        console.log('You can now start the devices with: npm start\n');

    } catch (error) {
        console.error('\n✗ Provisioning failed:', error.message);
        process.exit(1);
    }
}

/**
 * Start devices
 */
async function startCommand(options) {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('  IoT Dummy Devices Simulator');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log('Simulating multiple sensors across the city');
    console.log('Traffic: Rush hours 6:30-9am, 12-1pm, 5-7pm');
    console.log('Water: Tidal surge on full moon & new moon (±1-2 days)\n');

    try {
        // Initialize devices
        deviceManager.initializeDevices();

        // Connect to MQTT
        await deviceManager.connect();

        // Start devices based on options
        if (options.device) {
            deviceManager.startById(options.device);
        } else if (options.traffic) {
            deviceManager.startByType('traffic');
        } else if (options.water) {
            deviceManager.startByType('water');
        } else {
            deviceManager.startAll();
        }

        console.log('Press Ctrl+C to stop\n');

        // Keep process running
        process.stdin.resume();

    } catch (error) {
        console.error('✗ Failed to start devices:', error.message);
        process.exit(1);
    }
}

/**
 * List devices
 */
function listCommand(type = 'all') {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('  Configured Devices');
    console.log('═══════════════════════════════════════════════════════════════\n');

    if (type === 'all' || type === 'traffic') {
        console.log('TRAFFIC FLOW SENSORS:');
        config.devices.trafficDevices.forEach((device, index) => {
            console.log(`  [${index + 1}] ${device.deviceId}`);
            console.log(`      Entity: ${device.entityName}`);
            console.log(`      Location: ${device.location.lat}, ${device.location.lon}`);
            console.log(`      Interval: ${device.interval}ms`);
            console.log('');
        });
    }

    if (type === 'all' || type === 'water') {
        console.log('WATER LEVEL SENSORS:');
        config.devices.waterDevices.forEach((device, index) => {
            console.log(`  [${index + 1}] ${device.deviceId}`);
            console.log(`      Entity: ${device.entityName}`);
            console.log(`      Location: ${device.location.lat}, ${device.location.lon}`);
            console.log(`      Interval: ${device.interval}ms`);
            console.log(`      Drainage Capacity: ${device.drainageCapacity}m`);
            console.log('');
        });
    }

    const totalDevices = config.devices.trafficDevices.length + config.devices.waterDevices.length;
    console.log(`Total: ${totalDevices} devices configured\n`);
}

/**
 * Show status
 */
async function statusCommand() {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('  System Status');
    console.log('═══════════════════════════════════════════════════════════════\n');

    // Configuration
    console.log('CONFIGURATION:');
    console.log(`  MQTT Broker: ${config.mqtt.brokerUrl}`);
    console.log(`  IoT Agent: ${provisioning.IOTA_URL}`);
    console.log(`  FIWARE Service: ${config.fiware.service}`);
    console.log(`  Service Path: ${config.fiware.servicePath}`);
    console.log(`  API Key: ${config.ultralight.apiKey}`);
    console.log('');

    // Device counts
    console.log('DEVICES:');
    console.log(`  Traffic Sensors: ${config.devices.trafficDevices.length}`);
    console.log(`  Water Sensors: ${config.devices.waterDevices.length}`);
    console.log(`  Total: ${config.devices.trafficDevices.length + config.devices.waterDevices.length}`);
    console.log('');

    // Check IoT Agent
    console.log('CONNECTIVITY:');
    const isConnected = await provisioning.checkIoTAgent();
    console.log(`  IoT Agent: ${isConnected ? '✓ Connected' : '✗ Disconnected'}`);

    if (isConnected) {
        const provisionedData = await provisioning.getProvisionedDevices();
        console.log(`  Provisioned Devices: ${provisionedData.count || 0}`);
    }
    console.log('');
}

/**
 * Show configuration
 */
function configCommand() {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('  Current Configuration');
    console.log('═══════════════════════════════════════════════════════════════\n');

    console.log(JSON.stringify(config, null, 2));
    console.log('');
}

/**
 * Graceful shutdown handler
 */
async function shutdown() {
    await deviceManager.shutdown();
    process.exit(0);
}

// Handle shutdown signals
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

/**
 * Main CLI handler
 */
async function main() {
    if (!command || command === 'help' || command === '--help' || command === '-h') {
        showHelp();
        process.exit(0);
    }

    switch (command) {
        case 'auto':
            await autoCommand();
            break;

        case 'provision':
            const provisionType = args[1] || 'all';
            if (!['all', 'traffic', 'water'].includes(provisionType)) {
                console.error(`Invalid provision type: ${provisionType}`);
                console.error('Valid types: all, traffic, water');
                process.exit(1);
            }
            await provisionCommand(provisionType);
            break;

        case 'start':
            const startOptions = parseOptions(args.slice(1));
            await startCommand(startOptions);
            break;

        case 'list':
            const listType = args[1] || 'all';
            if (!['all', 'traffic', 'water'].includes(listType)) {
                console.error(`Invalid list type: ${listType}`);
                console.error('Valid types: all, traffic, water');
                process.exit(1);
            }
            listCommand(listType);
            break;

        case 'status':
            await statusCommand();
            break;

        case 'config':
            configCommand();
            break;

        default:
            console.error(`Unknown command: ${command}`);
            console.error('Run "node cli.js help" for usage information');
            process.exit(1);
    }
}

// Run CLI
main().catch(error => {
    console.error('Error:', error.message);
    process.exit(1);
});
