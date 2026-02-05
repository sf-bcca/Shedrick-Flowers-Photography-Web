# Usage Guide

This document covers how to run, build, and interact with the Shedrick Flowers Photography Web application.

## Running Locally (Development)

To start the development server with hot-reload:

```bash
pnpm dev
```

The application will typically start at `http://localhost:3000` (check your terminal for the exact port).

## Building for Production

To create an optimized production build:

```bash
pnpm run build
```

The output will be generated in the `dist/` directory. These files are static and can be deployed to any web server (Nginx, Apache, Vercel, Netlify, GitHub Pages).

### Previewing Production Build locally

To test the built version before deploying:

```bash
pnpm run preview
```

## Core Functionality

### 1. Admin Dashboard

Access the content management system at `/admin` (e.g., `http://localhost:3000/#/admin`).

- **Note**: You must be authenticated to access this area. Ensure you have set up Supabase Auth and created a user.

**Features:**

- **Dashboard Overview**:
  - **Statistics**: Immediate view of total Portfolio Items, Blog Posts, and Active Services.
  - **Content Chart**: Visual breakdown of content distribution using interactive bar charts.
- **Media Library**: View and manage all images stored in the system.
  - **Upload**: Drag and drop images or click to select files (Supports JPG, PNG, WEBP).
  - **Management**: Delete images or copy their public URL to the clipboard.
  - **Smart Naming**: Files are automatically renamed with a timestamp to prevent collisions.
- **Portfolio Manager**: Upload images, set categories, and manage display order.
- **Blog Manager**: Write and edit posts using the rich text editor.
  - **Status Workflow**: Posts can be saved as **Draft** (visible only to admins) or **Published** (visible to the public).
  - **Preview**: To preview a post, you must **Save** it first, then click the "Preview" eye icon to see it on the live site.
- **Services Manager**: Update pricing tiers, descriptions, and images.
  - *Note*: The 'features' list is defined in the database but currently not editable via the Admin UI.
- **Testimonials Manager**: Full control over client reviews displayed on the About page.
  - **Add/Edit**: Inputs for Client Name, Subtitle (Role/Service), Quote, Rating (1-5), and Display Order.
  - **Images**: Upload client photos directly; these are stored in the `testimonials/` folder in your storage bucket.
  - **Reordering**: Use the 'Display Order' field (integer) to control the sequence. Lower numbers appear first. If two testimonials have the same number, they are sorted by creation date.
- **Settings**: Comprehensive site configuration including:
  - **General**: Site title, description, and contact email.
  - **Branding**: Upload/update Logo, Hero Image, Avatar, and Favicon.
  - **About Photo**: Image used on the About page.
  - **Contact Info**: Phone, address, and social media links.
  - **Social Icons**: The site uses the modern 'X' logo for Twitter/X links.
- **Comments**: Moderation queue for blog comments.
  - New comments appear as **Pending**.
  - Admins must **Approve** comments for them to appear on the public site.
  - **Reject** removes the comment from the queue.
- **Contact Submissions**: Inquiries from the Contact page are handled via a dual-strategy for reliability:
  1.  **Email Notification**: Sent directly to your inbox via [Web3Forms](https://web3forms.com/). This requires the `VITE_WEB3FORMS_ACCESS_KEY` to be set in your `.env` file.
  2.  **Database Backup**: Automatically logged to the `contact_submissions` table in Supabase. This ensures you never miss a lead even if the email service fails. You can view these raw submissions directly in the Supabase Table Editor.

### 2. Public Site

- **Home**: Landing page with featured content.
- **Portfolio**: Filterable gallery of work.
- **Blog**: Read articles and leave comments (subject to approval).
- **Services**: View packages and pricing.
- **About**: View artist biography and client testimonials.

### 3. Studio Assistant (AI Chat)

A floating chat interface powered by Google Gemini AI, currently available on the Contact page.

- **Purpose**: Helps visitors visualize their session, get pricing info, and learn about services.
- **Dynamic Knowledge**: The assistant reads directly from your **Services** and **Settings** tables. Updates to your pricing or contact info in the dashboard are immediately reflected in the AI's answers.
- **Usage**: Click the chat bubble icon in the bottom-right corner.
- **Requirements**: Requires the `gemini-chat` Edge Function to be deployed and `GEMINI_API_KEY` set (see INSTALL.md).

## Configuration Options

### Tailwind CSS

This project uses the **Tailwind CSS Play CDN** for runtime styling, included directly in `index.html`.

- **Note**: This setup is convenient for rapid development but differs from a standard build-time Tailwind configuration. Custom styles and theme extensions are defined within the `<script>` tag in `index.html`.

### Port Configuration

By default, Vite runs on port 3000. You can change this in `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    port: 3000, // Change this value
    host: "0.0.0.0",
  },
  // ...
});
```

## Troubleshooting

This section covers common issues and their solutions.

### Connection Issues

#### Supabase Connection Failed

**Symptoms:** Data doesn't load, console shows network errors.

**Solutions:**

1. **Run the verification script:**
   This utility checks if your `.env` file exists, validates the presence of required keys (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`), and attempts a real network request to Supabase.

   ```bash
   # Node v20.6+
   node --env-file=.env verify-supabase.js

   # Older Node versions
   export $(grep -v '^#' .env | xargs) && node verify-supabase.js
   ```

2. Check your `.env` file:

   - `VITE_SUPABASE_URL` should be `https://your-project-ref.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` should be the `anon` public key (not the service role key)

3. **Restart your terminal** after editing `.env` — Vite caches environment variables.

---

### Authentication Issues

#### Admin Login Fails

**Symptoms:** Correct credentials but login rejected.

**Solutions:**

1. Check if user exists in Supabase Dashboard → Authentication → Users
2. Verify email confirmation (if enabled in Supabase settings)
3. Check browser console for specific error messages

#### Session Not Persisting

**Symptoms:** Logged out on page refresh.

**Solution:** Clear browser storage and re-login:

```javascript
// In browser console
localStorage.clear();
sessionStorage.clear();
```

---

### Storage / Image Upload Issues

#### Upload Fails with 403 Forbidden

**Cause:** Missing RLS policies on `storage.objects`.

**Solution:** Apply the storage policies from [`supabase_schema.sql`](supabase_schema.sql) or create them manually:

1. Go to Supabase Dashboard → Storage → Policies
2. Ensure authenticated users have INSERT, UPDATE, DELETE permissions on the `images` bucket
3. Ensure public (anon) users have SELECT permission

#### Image Not Displaying After Upload

**Cause:** Bucket is not public.

**Solution:**

1. Go to Supabase Dashboard → Storage → Select `images` bucket
2. Click Settings → Make bucket **Public**

---

### Row Level Security (RLS) Issues

#### "new row violates row-level security policy"

**Cause:** RLS policy blocks the operation.

**Solutions:**

1. Ensure you're authenticated when performing admin operations
2. Check the table's policies in Supabase Dashboard → Table Editor → [Table] → Policies
3. For the `settings` table, ensure policies allow operations only on `id = 1`

#### Data Visible in Dashboard But Not in App

**Cause:** RLS policy for `anon` role is missing or incorrect.

**Example:** Blog posts with `status = 'Draft'` are intentionally hidden from public view. To show a post, change its status to `Published`.

---

### Edge Function (Studio Assistant) Issues

#### Chat Returns "Function Not Found" or 404

**Cause:** Edge Function not deployed.

**Solution:**

```bash
npx supabase login
npx supabase link --project-ref <your-project-id>
npx supabase functions deploy gemini-chat
```

#### Chat Returns "Invalid API Key" or 500 Error

**Cause:** Missing `GEMINI_API_KEY` secret.

**Solution:**

```bash
npx supabase secrets set GEMINI_API_KEY=your_api_key_here
```

Get a key from [Google AI Studio](https://aistudio.google.com/).

#### Debugging Edge Function Logs

View logs for the deployed function:

```bash
npx supabase functions serve gemini-chat --debug
```

Or check logs in Supabase Dashboard → Edge Functions → gemini-chat → Logs.

---

### Build & Deployment Issues

#### Build Fails with "Cannot find module"

**Solution:**

```bash
rm -rf node_modules
pnpm install
```

#### Environment Variables Not Working in Production

**Cause:** Vite bakes environment variables at build time.

**Solution for Docker:** Pass build arguments:

```bash
docker build \
  --build-arg VITE_SUPABASE_URL=your_url \
  --build-arg VITE_SUPABASE_ANON_KEY=your_key \
  -t shedrick-photography-web .
```

---

### Getting More Help

1. Check Supabase logs: Dashboard → Logs → Select service (API, Auth, Storage)
2. Check browser console (`F12` → Console tab) for client-side errors
3. Review [INSTALL.md](INSTALL.md) for setup instructions
4. Review [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for system overview
