/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const mqttClient = require('./utils/mqttClient');
const config = require('./config');
const TrafficFlowObserved = require('./devices/trafficFlowObserved');
const WaterObserved = require('./devices/waterObserved');
const provisioning = require('./provisioning');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware to parse JSON
app.use(express.json());

// Store device instances
const devices = new Map();
const clients = new Set();

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to check IoT Agent status
app.get('/api/iot-agent/status', async (req, res) => {
    try {
        const isConnected = await provisioning.checkIoTAgent();
        const provisionedDevices = await provisioning.getProvisionedDevices();
        
        res.json({
            connected: isConnected,
            url: provisioning.IOTA_URL,
            devicesCount: provisionedDevices.count || 0,
            devices: provisionedDevices.devices || []
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API endpoint to provision service group
app.post('/api/provision/service-group', async (req, res) => {
    try {
        console.log('Provisioning service group...');
        const result = await provisioning.provisionServiceGroup();
        console.log('Service group provision result:', result);
        res.json({
            success: true,
            message: result.status === 409 ? 'Service group already exists' : 'Service group created',
            status: result.status
        });
    } catch (error) {
        console.error('Error provisioning service group:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// API endpoint to provision devices
app.post('/api/provision/devices', async (req, res) => {
    try {
        const { deviceType } = req.body; // 'traffic', 'water', or 'all'
        console.log(`Provisioning devices: ${deviceType || 'all'}`);
        const result = await provisioning.provisionDevices(deviceType || 'all');
        console.log('Device provision result:', result);
        
        res.json({
            success: true,
            message: result.status === 409 
                ? `${result.count} devices already registered` 
                : `${result.count} devices provisioned successfully`,
            status: result.status,
            count: result.count
        });
    } catch (error) {
        console.error('Error provisioning devices:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Initialize all devices
 */
async function initializeDevices() {
    console.log('=== IoT Device Controller Starting ===\n');

    try {
        // Connect to MQTT broker
        await mqttClient.connect();
        console.log('✓ Connected to MQTT broker\n');

        // Initialize traffic devices
        console.log('Initializing Traffic Flow Sensors:');
        config.devices.trafficDevices.forEach((deviceConfig, index) => {
            const device = new TrafficFlowObserved(deviceConfig);
            
            // Attach data callback to broadcast updates
            const originalSendMeasurement = device.sendMeasurement.bind(device);
            device.sendMeasurement = async function(data) {
                await originalSendMeasurement(data);
                broadcastDeviceUpdate(device.deviceId, data);
            };
            
            devices.set(device.deviceId, device);
            console.log(`  [${index + 1}] ${deviceConfig.deviceId}`);
        });

        // Initialize water devices
        console.log('\nInitializing Water Level Sensors:');
        config.devices.waterDevices.forEach((deviceConfig, index) => {
            const device = new WaterObserved(deviceConfig);
            
            // Attach data callback to broadcast updates
            const originalSendMeasurement = device.sendMeasurement.bind(device);
            device.sendMeasurement = async function(data) {
                await originalSendMeasurement(data);
                broadcastDeviceUpdate(device.deviceId, data);
            };
            
            devices.set(device.deviceId, device);
            console.log(`  [${index + 1}] ${deviceConfig.deviceId}`);
        });

        console.log(`\n✓ ${devices.size} devices initialized\n`);
    } catch (error) {
        console.error('Failed to initialize devices:', error.message);
        throw error;
    }
}

/**
 * Broadcast device data update to all connected clients
 */
function broadcastDeviceUpdate(deviceId, data) {
    const message = JSON.stringify({
        type: 'deviceUpdate',
        deviceId: deviceId,
        data: data
    });

    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

/**
 * Broadcast device status change to all connected clients
 */
function broadcastDeviceStatus(deviceId, running) {
    const message = JSON.stringify({
        type: 'deviceStatus',
        deviceId: deviceId,
        status: { running }
    });

    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

/**
 * Get device info for client
 */
function getDeviceInfo(device) {
    return {
        deviceId: device.deviceId,
        entityName: device.entityName,
        entityType: device.entityType,
        interval: device.interval,
        running: device.intervalId !== null
    };
}

/**
 * WebSocket connection handler
 */
wss.on('connection', (ws) => {
    console.log('New client connected');
    clients.add(ws);

    // Send device list to new client
    const deviceList = Array.from(devices.values()).map(getDeviceInfo);
    ws.send(JSON.stringify({
        type: 'deviceList',
        devices: deviceList
    }));

    // Handle messages from client
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            handleClientMessage(data);
        } catch (error) {
            console.error('Error handling client message:', error.message);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        clients.delete(ws);
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error.message);
    });
});

/**
 * Handle messages from clients
 */
function handleClientMessage(message) {
    const { type, deviceId } = message;
    const device = devices.get(deviceId);

    if (!device) {
        console.error(`Device not found: ${deviceId}`);
        return;
    }

    switch (type) {
        case 'start':
            if (!device.intervalId) {
                device.start();
                console.log(`[${deviceId}] Started by user`);
                broadcastDeviceStatus(deviceId, true);
            }
            break;

        case 'stop':
            if (device.intervalId) {
                device.stop();
                console.log(`[${deviceId}] Stopped by user`);
                broadcastDeviceStatus(deviceId, false);
            }
            break;

        case 'updateInterval':
            const wasRunning = device.intervalId !== null;
            if (wasRunning) {
                device.stop();
            }
            
            device.interval = message.interval;
            console.log(`[${deviceId}] Interval updated to ${message.interval}ms`);
            
            if (wasRunning) {
                device.start();
            }
            
            broadcastDeviceStatus(deviceId, wasRunning);
            break;

        default:
            console.warn(`Unknown message type: ${type}`);
    }
}

/**
 * Graceful shutdown
 */
async function shutdown() {
    console.log('\n\nShutting down...');

    // Stop all devices
    devices.forEach(device => device.stop());

    // Close WebSocket connections
    clients.forEach(client => client.close());
    wss.close();

    // Disconnect from MQTT
    await mqttClient.disconnect();

    console.log('✓ Shutdown complete');
    process.exit(0);
}

// Handle shutdown signals
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

/**
 * Start server
 */
async function start() {
    try {
        await initializeDevices();

        const PORT = process.env.PORT || 3000;
        server.listen(PORT, () => {
            console.log(`\nServer running on http://localhost:${PORT}`);
            console.log(`Open the web interface to control devices\n`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
}

start();
