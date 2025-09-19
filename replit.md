# Scholarship Hero - Replit Project Guide

## Overview

Scholarship Hero is a comprehensive web application designed to help students navigate the complex scholarship ecosystem, specifically focusing on Aadhaar seeding and Direct Benefit Transfer (DBT) processes. The platform serves as a one-stop portal for Pre-Matric and Post-Matric students to discover eligible scholarships, understand DBT requirements, and access educational resources.

The application addresses a critical problem where students face delays in scholarship payments due to confusion between Aadhaar-linked and DBT-enabled bank accounts. It provides interactive tools, multilingual support, and gamified learning experiences to empower students and their families.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side uses a modern React-based stack with TypeScript:
- **React 18** with functional components and hooks for state management
- **Vite** as the build tool and development server for fast hot module replacement
- **Wouter** for lightweight client-side routing instead of React Router
- **Tailwind CSS** with custom CSS variables for consistent theming
- **Shadcn/ui** component library providing pre-built, accessible UI components
- **Radix UI** primitives for complex interactive components like dialogs and forms

The architecture follows a component-based design with clear separation between:
- Pages (routing endpoints)
- Reusable UI components
- Business logic components (wizards, simulators, integrations)
- Shared utilities and hooks

### Backend Architecture
The server uses Express.js with TypeScript in an ESM module setup:
- **Express.js** for HTTP server and API routing
- **In-memory storage** implementation with interface-based design for easy database migration
- **RESTful API** design with consistent error handling middleware
- **Session-based** request logging with performance metrics
- **OpenAI integration** for AI-powered chat assistance

The backend follows a layered architecture:
- Route handlers for API endpoints
- Storage interface abstraction for data persistence
- Business logic separation for scholarship matching and eligibility checking

### Data Storage Strategy
Currently implements in-memory storage with a well-defined interface:
- **IStorage interface** defines all data operations
- **MemStorage class** provides in-memory implementation
- **Drizzle ORM** configuration prepared for PostgreSQL migration
- **Database schema** defined with proper relationships and constraints

Data models include:
- User management and authentication
- Scholarship applications with eligibility tracking
- WhatsApp subscriptions for notifications
- Help center locations with geospatial data
- Gamification progress and achievement tracking
- Chat message history for AI assistant

### Authentication and Authorization
- Session-based authentication framework in place
- User creation and management through storage interface
- Prepared for integration with government ID systems
- Privacy-focused approach with minimal data collection

### Multi-language Support
- **i18n system** with support for 6 languages: English, Hindi, Maithili, Bhojpuri, Tamil, Telugu
- Component-level language switching
- Cultural considerations for Indian government services
- Voice assistant integration with language-specific speech recognition

### External Service Integrations
- **OpenAI GPT integration** for intelligent chat assistance
- **WhatsApp Business API** preparation for subscription notifications
- **Geolocation services** for help center mapping
- **Government portal simulation** for DBT status checking
- **Voice recognition and synthesis** for accessibility features

### Performance Optimizations
- **React Query** for intelligent caching and state management
- **Lazy loading** components and routes
- **Optimized bundle splitting** through Vite
- **Progressive Web App** capabilities for offline access
- **Responsive design** for mobile-first accessibility

### Development and Production Setup
- **TypeScript** throughout with strict configuration
- **ESM modules** for modern JavaScript compatibility
- **Hot module replacement** for development efficiency
- **Production build optimization** with static asset generation
- **Error boundary** implementation for graceful failure handling

The architecture prioritizes accessibility, performance, and scalability while maintaining simplicity for rapid development and deployment. The modular design allows for easy feature additions and third-party integrations as the platform evolves.