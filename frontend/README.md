# Frontend

The Frontend component provides a modern web interface for Open-Terra's smart city platform. Built with Next.js and React, it delivers an interactive dashboard for real-time IoT data visualization, device management, and administrative functions.

## Skills & Badges

<p align="center">
    <img src="https://go-skill-icons.vercel.app/api/icons?i=typescript,nextjs,react,tailwindcss,git" alt="Skills" />
</p>

<p align="center">
    <a href="https://choosealicense.com/licenses/mit/">
        <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="MIT License">
    </a>
    <a href="https://nextjs.org/">
        <img src="https://img.shields.io/badge/Next.js-16.0-black" alt="Next.js">
    </a>
    <a href="https://github.com/dinhduongdev/Open-Terra">
        <img src="https://img.shields.io/badge/platform-Web-blue" alt="Platform">
    </a>
</p>

## Overview

This component serves as the primary user interface for the Open-Terra platform, providing intuitive access to IoT sensor data, interactive maps, and administrative controls. It offers a responsive, internationalized experience optimized for both desktop and mobile devices.

## Architecture

The Frontend is built using modern React patterns with Next.js App Router:

### Application Structure

**App Router** (`src/app/`)
- File-based routing with dynamic routes
- Nested layouts for consistent UI structure
- Server and client component architecture
- Internationalized routes with locale support
- Located in: `src/app/[locale]/`

**Components** (`src/components/`)
- Reusable UI components with TypeScript
- Organized by feature domain
- Shared common components
- Icon library and custom graphics

**State Management** (`src/store/`)
- Centralized application state
- Type-safe store definitions
- Action creators and selectors

**Internationalization** (`src/i18n.ts`)
- Multi-language support (English, Vietnamese)
- Message catalogs in `messages/` directory
- Locale-aware routing and content
- Built with next-intl

### Component Organization

**Admin Components** (`src/components/admin/`)
- User management interfaces
- System configuration panels
- Monitoring dashboards
- Analytics and reporting

**Authentication** (`src/components/auth/`)
- Login and registration forms
- Password reset workflows
- Session management
- OAuth integration UI

**Common Components** (`src/components/common/`)
- Buttons, inputs, and form controls
- Cards and containers
- Modals and dialogs
- Loading states and skeletons

**Layout Components** (`src/components/layout/`)
- Navigation bars and menus
- Sidebars and panels
- Headers and footers
- Responsive grid layouts

**Icon Components** (`src/components/icon/`)
- Custom SVG icons
- Icon library integration
- Reusable icon sets

## Key Features

- **Interactive Maps**: Real-time IoT device visualization with Leaflet and React Leaflet
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Internationalization**: Support for multiple languages (EN, VI)
- **Server-Side Rendering**: Optimized performance with Next.js SSR
- **Type Safety**: Full TypeScript coverage for reliability
- **Modern UI**: Clean, accessible interface with Tailwind CSS
- **Real-time Updates**: Live data visualization from IoT sensors
- **Admin Dashboard**: Comprehensive management interface
- **Authentication**: Secure login with session management

## Technology Stack

- **Next.js 16**: React framework with App Router and SSR
- **React 19**: Modern component architecture with hooks
- **TypeScript**: Type-safe development experience
- **Tailwind CSS**: Utility-first CSS framework
- **next-intl**: Internationalization and localization
- **Leaflet**: Interactive mapping library
- **React Leaflet**: React components for Leaflet maps
- **ESLint**: Code quality and consistency

## Pages and Routes

**Public Routes**
- `/`: Landing page with platform overview
- `/[locale]/`: Localized home page

**Protected Routes** (require authentication)
- `/[locale]/dashboard`: Main dashboard with IoT data
- `/[locale]/devices`: Device management interface
- `/[locale]/maps`: Interactive map visualization
- `/[locale]/analytics`: Data analysis and charts
- `/[locale]/admin`: Administrative controls

**Authentication Routes**
- `/[locale]/login`: User login
- `/[locale]/register`: New user registration
- `/[locale]/forgot-password`: Password recovery

## Map Integration

Interactive maps powered by Leaflet:

- Real-time device location markers
- Color-coded status indicators
- Popup details for sensor readings
- Layer controls for data filtering
- Responsive map controls for mobile

## Styling

Tailwind CSS configuration:

- Custom theme colors and spacing
- Responsive breakpoints
- Dark mode support (configurable)
- Component-scoped styles
- PostCSS processing

## Proxy Configuration

API proxy setup (`src/proxy.ts`):

- Routes frontend requests to backend API
- Handles CORS for development
- Session cookie forwarding
- Request/response interceptors

## Integration Points

This component integrates with other Open-Terra services:

- **backend**: Consumes REST API for data and authentication
- **context-broker**: Queries real-time IoT data via backend proxy
- **crawler**: Displays aggregated environmental data

## Build & Deployment

**Development Mode**
- Hot module replacement
- Fast refresh for instant updates
- Source maps for debugging
- Port 3000 (default)

**Production Mode**
- Optimized bundle with tree-shaking
- Static generation where possible
- Image optimization
- Minified assets

## Architecture Considerations

**Performance**
- Server-side rendering for initial load
- Code splitting per route
- Image optimization with Next.js Image
- Lazy loading for components
- Memoization for expensive computations

**Accessibility**
- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance

**SEO**
- Server-rendered meta tags
- Structured data markup
- Sitemap generation
- Optimized page titles and descriptions

**Security**
- XSS protection via React
- CSRF token handling
- Secure cookie configuration
- Input sanitization
- Content Security Policy headers

## Documentation

For detailed setup, configuration, and development instructions, refer to the [Open-Terra Wiki](https://github.com/dinhduongdev/Open-Terra/wiki).

## Standards Compliance

- Web Content Accessibility Guidelines (WCAG)
- Responsive web design principles
- Modern JavaScript (ES2022+)
- React best practices
- Next.js conventions
- TypeScript strict mode

## License

This component is part of the Open-Terra project, licensed under the MIT License.
