# IoT Device Simulator

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)](https://nodejs.org/)
[![FIWARE](https://img.shields.io/badge/FIWARE-NGSI--LD-orange.svg)](https://www.fiware.org/)

> A realistic IoT device simulator for traffic flow and flood monitoring in smart cities, compliant with FIWARE Smart Data Models and NGSI-LD standards.

## Overview

This module simulates multiple IoT devices that monitor traffic conditions and water levels at various locations in Ho Chi Minh City, Vietnam. The devices transmit data via MQTT using the UltraLight 2.0 protocol, following FIWARE Smart Data Models standards.

**Key Capabilities:**
- **Traffic Flow Monitoring**: Real-time vehicle count, speed tracking, congestion detection with rush hour simulation (6:30-9 AM, 12-1 PM, 5-7 PM)
- **Water Level Monitoring**: Water level measurement, flow rate monitoring, flood status classification with tidal surge prediction based on lunar calendar
- **Web Interface**: Individual device control, real-time data visualization, and adjustable transmission intervals

## Architecture

```
.
├── config.js                      # Multi-device configuration
├── devices/                       # Device implementation classes
│   ├── BaseDevice.js              # Abstract base class for all devices
│   ├── trafficFlowObserved.js     # Traffic monitoring device logic
│   └── waterObserved.js           # Water monitoring device logic
├── docker/                        # Docker deployment files
│   ├── build.sh                   # Docker build script
│   ├── docker-compose.yml         # Docker Compose configuration
│   └── Dockerfile                 # Container image definition
├── index.js                       # Main entry point & CLI runner
├── package-lock.json              # NPM dependency lock file
├── package.json                   # Node.js dependencies
├── provisioning.js                # Device provisioning script
├── public/                        # Web UI assets
│   └── index.html                 # Web dashboard interface
├── README.md                      # This file
├── server.js                      # Web UI server (Express.js)
└── utils/                         # Utility modules
    ├── lunarCalendar.js           # Lunar calendar & tidal calculator
    ├── mqttClient.js              # MQTT connection manager
    └── ultralightEncoder.js       # UltraLight 2.0 protocol encoder
```

## Prerequisites

- Docker & Docker Compose
- Git

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/dinhduongdev/Open-Terra.git
   cd Open-Terra
   ```

2. **Start the entire FIWARE stack**
   ```bash
   cd context-broker
   docker network create open-terra-network
   docker compose up
   ```
   
   This will start:
   - MongoDB
   - Orion-LD Context Broker
   - Eclipse Mosquitto MQTT Broker
   - IoT Agent UltraLight 2.0

3. **Start the IoT device simulator**
   ```bash
   cd ../dummy-iot-devices/docker
   docker-compose up -d
   ```

4. **Access the Web UI**
   
   Open your browser at: http://localhost:3030
   
   The simulator will automatically:
   - Connect to the MQTT broker
   - Provision devices via IoT Agent
   - Start transmitting sensor data
   - Display real-time data on the dashboard

5. **View logs**
   ```bash
   docker-compose logs -f dummy-iot-devices
   ```

6. **Stop the simulator**
   ```bash
   docker-compose down
   ```

## Configuration


### Docker Compose Configuration

For Docker deployment, environment variables can also be set in `docker/docker-compose.yml`. The simulator connects to the FIWARE stack via the `open-terra-network` Docker network.

**Default Ports:**
- Web UI: `3030` (maps to container port 3000)
- MQTT Broker: `1883` (from context-broker stack)
- IoT Agent: `4041` (from context-broker stack)


### Environment Variables

The simulator can be configured using environment variables:

```env
# MQTT Broker Configuration
MQTT_BROKER_URL=mqtt://localhost:1883

# IoT Agent Configuration
IOTA_URL=http://localhost:4041

# API Key for UltraLight 2.0
API_KEY=your-api-key-for-ultralight

# FIWARE Service Headers
FIWARE_SERVICE=openiot
FIWARE_SERVICEPATH=/

# Device Configuration
# Traffic Devices
TRAFFIC_DEVICE_ID_1=traffic001
TRAFFIC_ENTITY_NAME_1=urn:ngsi-ld:TrafficFlowObserved:001
TRAFFIC_DEVICE_ID_2=traffic002
TRAFFIC_ENTITY_NAME_2=urn:ngsi-ld:TrafficFlowObserved:002
TRAFFIC_DEVICE_ID_3=traffic003
TRAFFIC_ENTITY_NAME_3=urn:ngsi-ld:TrafficFlowObserved:003
TRAFFIC_INTERVAL=30000

# Water Devices
WATER_DEVICE_ID_1=water001
WATER_ENTITY_NAME_1=urn:ngsi-ld:WaterObserved:001
WATER_DEVICE_ID_2=water002
WATER_ENTITY_NAME_2=urn:ngsi-ld:WaterObserved:002
WATER_DEVICE_ID_3=water003
WATER_ENTITY_NAME_3=urn:ngsi-ld:WaterObserved:003
WATER_INTERVAL=30000
```

### Device Configuration

Edit `config.js` to customize:
- Sensor locations (latitude, longitude)
- Device IDs and entity names
- Measurement parameters
- Data transmission intervals

## Documentation

For detailed documentation please visit the [GitHub Wiki](https://github.com/dinhduongdev/Open-Terra/wiki).

## Data Models

This simulator implements FIWARE Smart Data Models:

- [TrafficFlowObserved](https://github.com/smart-data-models/dataModel.Transportation) - Traffic monitoring data
- [WaterObserved](https://github.com/smart-data-models/dataModel.Environment) - Water level and flood data

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
