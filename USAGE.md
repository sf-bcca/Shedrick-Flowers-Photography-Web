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
*   **Media Library**: View and manage all images stored in the system.
*   **Portfolio Manager**: Upload images, set categories, and manage display order.
*   **Blog Manager**: Write and edit posts using the rich text editor.
*   **Services Manager**: Update pricing tiers and features.
*   **Testimonials Manager**: Manage client testimonials and reviews.
*   **Settings**: Comprehensive site configuration including:
    *   **General**: Site title, description, and contact email.
    *   **Branding**: Upload/update Logo, Hero Image, Avatar, and Favicon.
    *   **About Photo**: Image used on the About page.
    *   **Contact Info**: Phone, address, and social media links (Instagram, Facebook, X/Twitter, LinkedIn).
*   **Comments**: Moderation queue for blog comments.
    *   New comments appear as **Pending**.
    *   Admins must **Approve** comments for them to appear on the public site.
    *   **Reject** removes the comment from the queue.
*   **Contact Submissions**: Inquiries from the Contact page are:
    *   Emailed directly to the `contact_email` configured in Settings.
    *   Logged to the `contact_submissions` table in Supabase for backup (accessible via Supabase Dashboard).

### 2. Public Site
*   **Home**: Landing page with featured content.
*   **Portfolio**: Filterable gallery of work.
*   **Blog**: Read articles and leave comments (subject to approval).
*   **Services**: View packages and pricing.

### 3. Studio Assistant (AI Chat)
A floating chat interface powered by Google Gemini AI, currently available on the Contact page.
*   **Purpose**: Helps visitors visualize their session, get pricing info, and learn about services.
*   **Usage**: Click the chat bubble icon in the bottom-right corner.
*   **Requirements**: Requires `GEMINI_API_KEY` to be configured in Supabase Secrets (see INSTALL.md).

## Configuration Options

### Tailwind CSS
This project uses the **Tailwind CSS Play CDN** for runtime styling, included directly in `index.html`.
*   **Note**: This setup is convenient for rapid development but differs from a standard build-time Tailwind configuration. Custom styles and theme extensions are defined within the `<script>` tag in `index.html`.

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

## Troubleshooting

### Verify Supabase Connection
If the application fails to load data, use the verification script to check your configuration:

```bash
node --env-file=.env verify-supabase.js
```

Ensure your `.env` file contains the correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
