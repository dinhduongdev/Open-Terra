# Context Broker

The Context Broker component provides the core FIWARE-compliant infrastructure for Open-Terra's IoT data management. Built on NGSI-LD standards, it handles real-time context information management, IoT device integration, and temporal data storage for smart city applications.

## Skills & Badges

<p align="center">
    <img src="https://go-skill-icons.vercel.app/api/icons?i=docker,postgresql,mongodb,redis" alt="Skills" />
</p>

<p align="center">
    <a href="https://choosealicense.com/licenses/mit/">
        <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="MIT License">
    </a>
    <a href="https://www.fiware.org/">
        <img src="https://img.shields.io/badge/FIWARE-NGSI--LD-orange.svg" alt="FIWARE">
    </a>
    <a href="https://github.com/dinhduongdev/Open-Terra">
        <img src="https://img.shields.io/badge/platform-Docker-blue" alt="Platform">
    </a>
</p>

## Overview

This component serves as the central data hub for the Open-Terra platform, managing the lifecycle of context information from IoT devices. It implements a complete FIWARE stack including context brokering, IoT protocol translation, message routing, and time-series data persistence.

## Architecture

The Context Broker consists of six integrated services orchestrated via Docker Compose:

### Core Services

**FIWARE Orion-LD**
- NGSI-LD compliant context broker
- Manages entity lifecycle and subscriptions
- Handles context data queries and updates
- Supports multi-tenancy with service/service-path isolation
- Integrates with TimescaleDB for temporal data persistence
- Exposed on port 1026

**MongoDB**
- Stores Orion-LD's operational data
- Maintains entity attribute metadata
- Persists IoT Agent device registrations and configurations
- Exposed on port 27017

**TimescaleDB**
- Time-series optimized PostgreSQL database
- Stores historical entity data via Temporal Representation of Entities (TRoE)
- Enables efficient temporal queries on IoT data
- Exposed on port 5432

### IoT Integration

**FIWARE IoT Agent UltraLight**
- Translates UltraLight 2.0 protocol to NGSI-LD entities
- Manages device provisioning and attribute mappings
- Bidirectional communication between devices and context broker
- Subscribes to MQTT topics for device data
- HTTP interface on port 4041, southbound on port 7896

**Eclipse Mosquitto**
- MQTT broker for device message routing
- Handles publish/subscribe messaging patterns
- Lightweight protocol ideal for constrained IoT devices
- Exposed on port 1883 (MQTT) and 9001 (WebSocket)

### Supporting Services

**FIWARE Mintaka**
- Provides temporal operations for historical data queries
- Queries TimescaleDB for time-based entity analysis
- NGSI-LD temporal API compliance
- Exposed on port 8080

**LD Context Server**
- Serves JSON-LD context definitions
- Provides semantic mappings for NGSI-LD attributes
- Integrates Smart Data Models context from FIWARE
- Hosted on port 3004

## Data Models

The component uses FIWARE Smart Data Models for standardized entity representation:

- **Weather**: WeatherObserved, WeatherForecast
- **Environment**: AirQualityObserved, WaterQualityObserved
- **Transportation**: TrafficFlowObserved

Custom context is defined in `ld-context/open-terra-context.jsonld`, combining multiple Smart Data Model namespaces with the NGSI-LD core context.

## Service Communication

![Open-Terra Context Broker Architecture](../assets/system-architecture.png)

## Key Features

- **NGSI-LD Compliance**: Full support for ETSI NGSI-LD API specifications
- **Temporal Data**: Automatic historization of entity changes with TimescaleDB
- **Multi-Protocol Support**: MQTT via UltraLight 2.0 protocol translation
- **Semantic Interoperability**: JSON-LD context with Smart Data Models
- **Multi-Tenancy**: Service and service-path based tenant isolation
- **Health Monitoring**: Built-in healthchecks for all services
- **Scalability**: Connection pooling and configurable resource limits

## Network Configuration

All services run on the `open-terra-network` Docker network (external). This enables:
- Service discovery via container names
- Isolation from other Docker applications
- Communication with other Open-Terra components (backend, crawler, frontend)

## Data Persistence

Three volumes ensure data durability:
- `timescale-db`: Time-series entity data
- `mongo-db`: Context broker and IoT Agent metadata
- `mongo-config`: MongoDB configuration

## Integration Points

This component integrates with other Open-Terra services:

- **dummy-iot-devices**: Receives sensor data via MQTT/UltraLight 2.0
- **crawler**: Can publish normalized data to Orion-LD via NGSI-LD API
- **backend**: Queries context data for application APIs
- **frontend**: Visualizes real-time and historical entity data

## Documentation

For detailed setup, configuration, and usage instructions, refer to the [Open-Terra Wiki](https://github.com/dinhduongdev/Open-Terra/wiki).

## Standards Compliance

- ETSI NGSI-LD API v1.8
- FIWARE Data Models
- MQTT 3.1.1
- UltraLight 2.0 Protocol
- JSON-LD 1.1

## License

This component is part of the Open-Terra project, licensed under the MIT License.