# Backend

The Backend component provides the core application API for Open-Terra's smart city platform. It delivers RESTful endpoints for user management, authentication, data access, and administrative functions with role-based access control.

## Skills & Badges

<p align="center">
    <img src="https://go-skill-icons.vercel.app/api/icons?i=python,fastapi,postgresql,redis,docker,git" alt="Skills" />
</p>

<p align="center">
    <a href="https://choosealicense.com/licenses/mit/">
        <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="MIT License">
    </a>
    <a href="https://github.com/dinhduongdev/Open-Terra">
        <img src="https://img.shields.io/badge/API-REST-blue" alt="API">
    </a>
    <a href="https://github.com/dinhduongdev/Open-Terra">
        <img src="https://img.shields.io/badge/platform-Docker-blue" alt="Platform">
    </a>
</p>

## Overview

This component serves as the primary application layer for the Open-Terra platform, providing secure API endpoints for frontend consumption and third-party integrations. Built with FastAPI, it handles user authentication, authorization, data queries, and business logic orchestration.

## Architecture

The Backend is structured as a layered FastAPI application following clean architecture principles:

### Application Layers

**API Layer** (`src/app/api/`)
- RESTful endpoint definitions
- Request/response models
- Route organization and versioning
- Dependency injection for services
- OpenAPI/Swagger documentation

**Business Logic Layer** (`src/app/crud/`)
- CRUD operations for all entities
- Business rule enforcement
- Transaction management
- Data validation and transformation

**Data Access Layer** (`src/app/models/`)
- SQLAlchemy ORM models
- Database schema definitions
- Relationship mappings
- Index and constraint definitions

**Schema Layer** (`src/app/schemas/`)
- Pydantic models for validation
- API request/response schemas
- Data transfer objects (DTOs)
- Type safety and serialization

### Core Services

**PostgreSQL Database**
- Primary data store for application data
- User accounts and authentication
- Entity metadata and relationships
- Transactional integrity

**Redis Cache**
- Session storage and management
- API response caching
- Rate limiting and throttling
- Temporary data storage

**Background Worker** (`src/app/core/worker/`)
- Asynchronous task processing
- Scheduled job execution
- Email notifications
- Data synchronization tasks

**Admin Interface** (`src/app/admin/`)
- Built-in administrative dashboard
- User management
- System configuration
- Monitoring and diagnostics

### Security & Middleware

**Authentication**
- JWT-based authentication
- OAuth2 password flow
- Token refresh mechanism
- Secure password hashing with bcrypt

**Authorization**
- Role-based access control (RBAC)
- Permission-based endpoint protection
- Resource-level authorization
- Service and tenant isolation

**Middleware** (`src/app/middleware/`)
- CORS configuration
- Request logging and tracing
- Error handling and formatting
- Rate limiting enforcement

## Key Features

- **RESTful API**: Comprehensive endpoints for all platform operations
- **Authentication & Authorization**: Secure JWT-based auth with RBAC
- **Admin Dashboard**: Built-in interface for system administration
- **API Documentation**: Auto-generated Swagger/ReDoc documentation
- **Background Tasks**: Async job processing with ARQ
- **Database Migrations**: Alembic-based schema version control
- **Type Safety**: Full Pydantic validation and type hints
- **Testing**: Comprehensive test suite with pytest
- **Error Handling**: Structured error responses with proper HTTP codes
- **Logging**: Structured logging with configurable levels

## Technology Stack

- **FastAPI**: Modern async web framework with automatic OpenAPI docs
- **SQLAlchemy**: Powerful ORM with relationship management
- **Alembic**: Database migration and version control
- **Pydantic**: Data validation using Python type annotations
- **Redis**: In-memory cache and session store
- **ARQ**: Async task queue for background jobs
- **PostgreSQL**: Relational database for data persistence
- **JWT**: Secure token-based authentication
- **Bcrypt**: Password hashing and verification
- **pytest**: Testing framework with async support

## Integration Points

This component integrates with other Open-Terra services:

- **context-broker**: Queries entity data from Orion-LD
- **crawler**: Shares PostgreSQL database for configuration
- **frontend**: Provides API endpoints for UI consumption
- **dummy-iot-devices**: Manages device provisioning and configuration

## Architecture Considerations

**Scalability**
- Stateless API design for horizontal scaling
- Redis for distributed session management
- Connection pooling for database efficiency
- Async I/O for high concurrency

**Security**
- Input validation on all endpoints
- SQL injection prevention via ORM
- XSS protection in responses
- CSRF token validation
- Rate limiting per user/IP

**Maintainability**
- Layered architecture with clear separation
- Dependency injection for testability
- Type hints for IDE support
- Comprehensive documentation

## Documentation

For detailed setup, configuration, and API usage instructions, refer to the [Open-Terra Wiki](https://github.com/dinhduongdev/Open-Terra/wiki).

## Standards Compliance

- REST API design principles
- OpenAPI 3.0 specification
- OAuth2 authentication standard
- HTTP status code conventions
- Python PEP 8 code style
- OWASP security best practices

## License

This component is part of the Open-Terra project, licensed under the MIT License.
