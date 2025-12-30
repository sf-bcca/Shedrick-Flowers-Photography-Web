# Shedrick Flowers Photography Web

![Development Status](https://img.shields.io/badge/Status-Active-green)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

A professional photography portfolio website built with React, Vite, and Supabase. This application features a dynamic portfolio, blog with commenting system, service listings, client testimonials, and a comprehensive admin dashboard for content management.

## Table of Contents

- [Key Features](#key-features)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Technologies](#technologies)

## Key Features

- **Dynamic Portfolio**: Showcase photography with categorization and custom layout options.
- **Blog System**: Rich text blogging platform with user comments and moderation.
- **Service Listings**: Display pricing tiers and service details.
- **Client Testimonials**: Dedicated management for client reviews and ratings.
- **Studio Assistant**: AI-powered chat agent (Google Gemini) to help visitors with pricing and services.
- **Admin Dashboard**: Protected area to manage all content, site settings, and media.
- **Responsive Design**: Optimized for all devices using Tailwind CSS.
- **Dark Mode**: Native dark mode support.

## Quick Start

**Prerequisites**: Node.js v18+

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install --legacy-peer-deps
    ```
3.  Set up environment variables (see [INSTALL.md](INSTALL.md)).
4.  Run the development server:
    ```bash
    npm run dev
    ```
5.  Verify Connection
    Run `node --env-file=.env verify-supabase.js` to confirm your local environment is correctly connected to Supabase.

## Documentation

For detailed instructions, please refer to the following guides:

- [**Installation Guide (INSTALL.md)**](INSTALL.md) - Detailed setup, database configuration, and Docker deployment.
- [**Usage Guide (USAGE.md)**](USAGE.md) - How to run, build, and use the application features.
- [**Contributing Guide (CONTRIBUTING.md)**](CONTRIBUTING.md) - Guidelines for developers.

### Technical Reference

- [**Architecture Overview (docs/ARCHITECTURE.md)**](docs/ARCHITECTURE.md) - System diagrams and data flow.
- [**API Reference (docs/API_REFERENCE.md)**](docs/API_REFERENCE.md) - Service functions and TypeScript interfaces.

## Technologies

- **Frontend**: React 19, React Router v7, Vite
- **Styling**: Tailwind CSS
- **Backend/Database**: Supabase (PostgreSQL, Auth, Storage)
- **AI**: Google Gemini (via Supabase Edge Functions)
- **Icons**: Lucide React, Material Symbols
- **Rich Text**: @tiptap/react
