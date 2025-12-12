# Usage Guide

This document covers how to run, build, and interact with the Shedrick Flowers Photography Web application.

## Running Locally (Development)

To start the development server with hot-reload:

```bash
npm run dev
```

The application will typically start at `http://localhost:3000` (check your terminal for the exact port).

## Building for Production

To create an optimized production build:

```bash
npm run build
```

The output will be generated in the `dist/` directory. These files are static and can be deployed to any web server (Nginx, Apache, Vercel, Netlify, GitHub Pages).

### Previewing Production Build locally
To test the built version before deploying:

```bash
npm run preview
```

## Core Functionality

### 1. Admin Dashboard
Access the content management system at `/admin` (e.g., `http://localhost:3000/#/admin`).
*   **Note**: You must be authenticated to access this area. Ensure you have set up Supabase Auth and created a user.

**Features:**
*   **Portfolio Manager**: Upload images, set categories, and manage display order.
*   **Blog Manager**: Write and edit posts using the rich text editor.
*   **Services Manager**: Update pricing tiers and features.
*   **Settings**: Configure site title, logo, and social media links.
*   **Comments**: Approve or reject user comments on blog posts.

### 2. Public Site
*   **Home**: Landing page with featured content.
*   **Portfolio**: Filterable gallery of work.
*   **Blog**: Read articles and leave comments (subject to approval).
*   **Services**: View packages and pricing.

## Configuration Options

### Tailwind CSS
The visual theme is configured in `tailwind.config.js` (embedded in `index.html` for this project or a separate file). You can customize colors, fonts, and animations there.

### Port Configuration
By default, Vite runs on port 3000. You can change this in `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    port: 3000, // Change this value
    host: '0.0.0.0',
  },
  // ...
});
```
