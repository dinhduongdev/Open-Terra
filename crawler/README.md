# Crawler

The Crawler component provides automated data collection and normalization services for Open-Terra's IoT platform. It ingests real-time environmental data from external APIs, normalizes it to FIWARE Smart Data Models, and publishes to the Context Broker.

## Skills & Badges

<p align="center">
    <img src="https://go-skill-icons.vercel.app/api/icons?i=python,fastapi,postgresql,redis,docker,git" alt="Skills" />
</p>

<p align="center">
    <a href="https://choosealicense.com/licenses/mit/">
        <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="MIT License">
    </a>
    <a href="https://www.fiware.org/">
        <img src="https://img.shields.io/badge/FIWARE-Smart_Data_Models-orange.svg" alt="FIWARE">
    </a>
    <a href="https://github.com/dinhduongdev/Open-Terra">
        <img src="https://img.shields.io/badge/platform-Docker-blue" alt="Platform">
    </a>
</p>

## Overview

This component serves as a data aggregation layer that bridges external data sources with the Open-Terra platform. It continuously fetches data from public APIs (OpenWeatherMap, OpenAQ), transforms the data into NGSI-LD compliant entities, and publishes to FIWARE Orion-LD for consumption by other services.

## Architecture

The Crawler is built on a modular FastAPI application with the following components:

### Core Services

**FastAPI Web Application**
- RESTful API for crawler management and monitoring
- Automatic OpenAPI/Swagger documentation
- Async request handling with uvicorn/gunicorn workers
- Health check endpoints for service monitoring
- Exposed on port 8000

**Background Worker (ARQ)**
- Asynchronous task queue for scheduled data fetching
- Redis-backed job queue for reliable execution
- Configurable intervals for different data sources
- Automatic retry logic for failed requests
- Isolated worker process for resource management

**PostgreSQL Database**
- Stores crawler configuration and metadata
- Maintains job execution history and logs
- Tracks data source credentials and endpoints
- Alembic migrations for schema version control

**Redis Cache**
- Task queue backend for ARQ workers
- Session storage and rate limiting
- Temporary data caching for API responses

### Data Pipeline Components

**Service Clients**
- `OpenWeatherMapClient`: Fetches current weather conditions
- `OpenAQClient`: Retrieves air quality measurements
- Extensible architecture for adding new data sources
- Located in: `src/app/services/`

**Data Normalizers**
- `WeatherNormalizer`: Converts weather data to WeatherObserved entities
- `AirQualityNormalizer`: Transforms air quality to AirQualityObserved entities
- Smart Data Models compliance for standardized output
- Located in: `src/app/normalizers/`

**Publishers**
- `OrionLDPublisher`: Publishes NGSI-LD entities to Context Broker
- Batch operation support for efficient data transfer
- Automatic entity update or creation logic
- FIWARE service/service-path header management
- Located in: `src/app/publishers/`

## Data Sources

Current integrated external APIs:

- **OpenWeatherMap**: Real-time weather observations (temperature, humidity, pressure, wind)
- **OpenAQ**: Air quality measurements (PM2.5, PM10, NO2, O3, CO)

Each source is configurable via environment variables for API keys, endpoints, and fetch intervals.

## Data Flow

![Open-Terra Context Broker Architecture](../assets/system-architecture.png)

## Key Features

- **Scheduled Data Collection**: Configurable intervals for automatic data fetching
- **Smart Data Models Compliance**: NGSI-LD entity standardization
- **Async Processing**: Non-blocking I/O for high-throughput data ingestion
- **Error Handling**: Automatic retry with exponential backoff
- **Admin Interface**: Built-in CRUD admin for configuration management
- **API Documentation**: Auto-generated Swagger UI for API exploration
- **Health Monitoring**: Readiness and liveness probes for orchestration
- **Extensible Architecture**: Plugin-based design for new data sources

## Technology Stack

- **FastAPI**: Modern async web framework
- **SQLAlchemy 2.0**: ORM with async support
- **Alembic**: Database migration management
- **ARQ**: Async task queue with Redis
- **Pydantic**: Data validation and settings management
- **HTTPX**: Async HTTP client for API calls
- **CRUDAdmin**: Auto-generated admin interface

## Service Configuration

The crawler supports multiple deployment modes via Docker Compose:

**Development Mode** (default)
- Uvicorn with auto-reload
- Direct port exposure (8000)
- Volume mounts for hot-reload

**Production Mode** (commented)
- Gunicorn with Uvicorn workers
- Nginx reverse proxy
- Optimized for performance

## Integration Points

This component integrates with other Open-Terra services:

- **context-broker**: Publishes normalized entities to Orion-LD via NGSI-LD API
- **backend**: Shares PostgreSQL database for unified data access
- **frontend**: Provides admin UI for crawler configuration

## Architecture Considerations

**Scalability**
- Horizontal scaling via multiple worker instances
- Redis queue for distributed task processing
- Connection pooling for database efficiency

**Reliability**
- Health checks for orchestration
- Automatic retry with exponential backoff
- Dead letter queue for failed tasks

**Maintainability**
- Alembic migrations for schema evolution
- Type hints and Pydantic validation
- Comprehensive logging with structured output

## Documentation

For detailed setup, configuration, and usage instructions, refer to the [Open-Terra Wiki](https://github.com/dinhduongdev/Open-Terra/wiki).

## Standards Compliance

- FIWARE Smart Data Models
- NGSI-LD API specification
- REST API best practices
- OpenAPI 3.0 specification
- Python PEP 8 code style

## License

This component is part of the Open-Terra project, licensed under the MIT License.
