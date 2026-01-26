# Installation & Setup Guide

This guide will help you set up the Shedrick Flowers Photography Web application for local development or self-hosted deployment.

## Prerequisites

- **Node.js**: Version 18 or higher (LTS recommended).
- **pnpm**: Fast, disk space efficient package manager.
- **Supabase Account**: For database, authentication, and storage.
- **Docker** (Optional): For containerized self-hosting.

## 1. Clone the Repository

```bash
git clone https://github.com/sf-bcca/Shedrick-Flowers-Photography-Web.git
cd Shedrick-Flowers-Photography-Web
```

## 2. Install Dependencies

Install the required Node.js packages using `pnpm`.

```bash
pnpm install
```

_Note: Supabase Edge Functions (in `supabase/functions/`) use Deno and manage their own dependencies via `import_map.json` or direct URL imports. You do not need to run `pnpm install` inside the functions directory._

## 3. Environment Configuration

1.  Copy the example environment file:

    ```bash
    cp .env.example .env
    ```

2.  Open `.env` and fill in the required values:

    ```env
    VITE_SUPABASE_URL=https://your-project-ref.supabase.co
    VITE_SUPABASE_ANON_KEY=your-anon-public-key
    VITE_WEB3FORMS_ACCESS_KEY=your-web3forms-key
    ```

### Environment Variables Reference

| Variable                    | Required    | Description                                                                                                                                                              |
| --------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `VITE_SUPABASE_URL`         | ✅ Yes      | Your Supabase project URL. Found in Supabase Dashboard → Project Settings → API → Project URL                                                                            |
| `VITE_SUPABASE_ANON_KEY`    | ✅ Yes      | The `anon` public API key (NOT the service role key). Found in Supabase Dashboard → Project Settings → API → Project API Keys                                            |
| `VITE_WEB3FORMS_ACCESS_KEY` | ❌ Optional | Access key for [Web3Forms](https://web3forms.com/) contact form email delivery. If omitted, contact submissions are still saved to the database but emails won't be sent |

> **Note:** Environment variables prefixed with `VITE_` are exposed to the client. Never put secret keys in these variables. The Gemini API key is stored as a Supabase secret (see Step 4).

## 4. Deploy Edge Functions (AI Features)

The "Studio Assistant" feature uses a Supabase Edge Function (`gemini-chat`) powered by Google Gemini AI. You must deploy this function to your Supabase project for the chat to work.

### Step 1: Link your Project

You need your Supabase Project Reference ID (found in your Dashboard URL: `https://supabase.com/dashboard/project/<project-id>`).

```bash
npx supabase login
npx supabase link --project-ref <your-project-id>
```

### Step 2: Set Secrets

Obtain a Gemini API Key from [Google AI Studio](https://aistudio.google.com/). Then set it as a secret:

```bash
npx supabase secrets set GEMINI_API_KEY=your_api_key_here
```

### Step 3: Deploy

Deploy the function code from the `supabase/functions` directory:

```bash
npx supabase functions deploy gemini-chat
```

## 5. Database Setup (Supabase)

The application relies on specific database tables in Supabase.

1.  Go to the **SQL Editor** in your Supabase dashboard.
2.  Open the `supabase_schema.sql` file provided in this repository.
3.  Copy the entire contents and paste them into the SQL Editor.
4.  Run the script to create all necessary tables, functions, and policies (`portfolio`, `blog`, `services`, `settings`, `comments`, `testimonials`, `contact_submissions`).

### Storage Setup

1.  Go to **Storage** in Supabase.
2.  Create a new bucket named `images`.
3.  Set the bucket to **Public**.
4.  Add a policy to allow authenticated users to upload/update/delete files, and anyone to read files.
    - **Folder Structure:** The application automatically handles file organization using the following subfolders:
      - `portfolio/` - Portfolio images
      - `blog/` - Blog post images
      - `testimonials/` - Client photos
      - `services/` - Service tier images
    - _Note: You do not need to create these folders manually; the application will create them upon first upload._

## 6. Verify Installation

Before running the application, verify that your local environment is correctly connected to Supabase. This script performs the following checks:
1.  **Environment File**: Confirms `.env` exists.
2.  **Required Variables**: Checks for `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3.  **Optional Variables**: Warns if `VITE_WEB3FORMS_ACCESS_KEY` is missing (non-critical).
4.  **Network Connection**: Attempts to fetch the `settings` table from your Supabase project.

### Option A: Node.js v20.6 or newer (Recommended)

Use the native `--env-file` flag to load your configuration:

```bash
node --env-file=.env verify-supabase.js
```

### Option B: Older Node.js versions

If you are using an older version of Node.js (e.g., v18), you must load the environment variables manually before running the script.

**Mac/Linux:**

```bash
# Export variables from .env and run
export $(grep -v '^#' .env | xargs) && node verify-supabase.js
```

**Windows (PowerShell):**

```powershell
# Manually set the variables (replace with your values)
$env:VITE_SUPABASE_URL="your_url"; $env:VITE_SUPABASE_ANON_KEY="your_key"; node verify-supabase.js
```

If successful, you will see: `✅ Supabase Connection Successful`.

## 7. Docker Setup (Self-Hosting)

If you intend to self-host this application using Docker (e.g., on Proxmox LXC), follow these steps.

### Build the Image

To build the production image, you must pass your Supabase credentials as build arguments. These are baked into the static build.

```bash
docker build \
  --build-arg VITE_SUPABASE_URL=your_supabase_url \
  --build-arg VITE_SUPABASE_ANON_KEY=your_anon_key \
  -t shedrick-photography-web .
```

### Run the Container

```bash
docker run -d \
  -p 80:80 \
  --name photography-web \
  shedrick-photography-web
```

_Note: Since this is a Client-Side Rendered (CSR) app (Vite + React), the Docker container effectively serves static files generated by `pnpm run build`. You do not need the Node.js runtime in the final container, just a web server like Nginx._
