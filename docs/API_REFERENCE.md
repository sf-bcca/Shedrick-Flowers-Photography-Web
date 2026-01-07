# API Reference

This document provides a reference for the service layer functions used throughout the application.

## Table of Contents

- [Supabase Client](#supabase-client)
  - [Data Fetching](#data-fetching)
  - [CRUD Operations](#crud-operations)
  - [Blog-Specific Functions](#blog-specific-functions)
- [Image Optimizer](#image-optimizer)
- [Storage Utilities](#storage-utilities)
- [TypeScript Interfaces](#typescript-interfaces)

---

## Supabase Client

**Location:** [`src/services/supabaseClient.ts`](../src/services/supabaseClient.ts)

### Data Fetching

#### `fetchSettings()`

Fetches global site settings with caching and request deduplication.

```typescript
fetchSettings(): Promise<Settings | null>
```

| Property          | Description                                       |
| ----------------- | ------------------------------------------------- |
| **Returns**       | `Settings` object or `null` if error              |
| **Caching**       | Results are cached in memory for the session      |
| **Deduplication** | Simultaneous calls share a single network request |

**Example:**

```typescript
import { fetchSettings } from "./services/supabaseClient";

const settings = await fetchSettings();
if (settings) {
  console.log(settings.site_title); // "Shedrick Flowers Photography"
}
```

---

#### `fetchData(table, select)`

Fetches all records from a specified table.

```typescript
fetchData(
  table: 'portfolio' | 'blog' | 'services' | 'testimonials' | 'comments' | 'contact_submissions',
  select?: string
): Promise<any[]>
```

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `table` | Union String | Target table name (e.g., `'portfolio'`, `'testimonials'`) |
| `select` | String | Optional columns to select (default: `'*'`) |

| Property     | Description                                        |
| ------------ | -------------------------------------------------- |
| **Returns**  | Array of records sorted by `created_at` descending |
| **On Error** | Logs to console, returns empty array `[]`          |

**Example:**

```typescript
import { fetchData } from "./services/supabaseClient";
import { PortfolioItem } from "./types";

// Fetch all fields
const items = (await fetchData("portfolio")) as PortfolioItem[];

// Fetch specific fields only
const services = await fetchData("services", "id, title, image");
```

---

#### `fetchPublishedBlogPosts()`

Fetches only published blog posts for public display (optimized payload).

```typescript
fetchPublishedBlogPosts(): Promise<BlogPost[]>
```

| Property         | Description                                           |
| ---------------- | ----------------------------------------------------- |
| **Returns**      | Array of published `BlogPost` objects (metadata only) |
| **Optimization** | Excludes `content` field to reduce payload size       |
| **Sorting**      | By `date` field descending                            |

> **Note:** This function returns partial `BlogPost` objects without the `content` field. Use `fetchPostById()` to get the full post content.

---

### CRUD Operations

#### `createItem(table, item)`

Creates a new record in the specified table.

```typescript
createItem(
  table: 'portfolio' | 'blog' | 'services' | 'testimonials' | 'comments',
  item: any
): Promise<PostgrestResponse>
```

| Parameter | Type         | Description                                |
| --------- | ------------ | ------------------------------------------ |
| `table`   | Union String | Target table                               |
| `item`    | Object       | Data to insert (ID field is auto-stripped) |

**Example:**

```typescript
const { data, error } = await createItem("portfolio", {
  title: "Wedding Session",
  category: "Wedding",
  image: "https://...",
});
```

---

#### `updateItem(table, id, updates)`

Updates an existing record by ID.

```typescript
updateItem(
  table: 'portfolio' | 'blog' | 'services' | 'testimonials' | 'comments',
  id: string,
  updates: Partial<PortfolioItem | BlogPost | ServiceTier | Testimonial | Comment>
): Promise<PostgrestResponse>
```

| Parameter | Type          | Description           |
| --------- | ------------- | --------------------- |
| `table`   | String        | Target table          |
| `id`      | String (UUID) | Record identifier     |
| `updates` | Object        | Partial update object |

---

#### `deleteItem(table, id)`

Deletes a record by ID.

```typescript
deleteItem(
  table: 'portfolio' | 'blog' | 'services' | 'testimonials' | 'comments',
  id: string
): Promise<PostgrestResponse>
```

---

### Blog-Specific Functions

#### `fetchPostById(id)`

Fetches a single blog post with full content.

```typescript
fetchPostById(id: string): Promise<BlogPost | null>
```

| Parameter | Type          | Description  |
| --------- | ------------- | ------------ |
| `id`      | String (UUID) | Blog post ID |

---

#### `fetchRelatedPosts(currentPostId, category)`

Fetches related posts using smart fallback logic.

```typescript
fetchRelatedPosts(
  currentPostId: string,
  category: string
): Promise<BlogPost[]>
```

**Strategy:**

1. First, finds up to 3 published posts in the same category
2. If fewer than 3 found, fills remaining slots with recent posts
3. Always excludes the current post

| Property     | Description                               |
| ------------ | ----------------------------------------- |
| **Returns**  | Up to 3 related `BlogPost` objects        |
| **Security** | Only returns `status = 'Published'` posts |

---

## Image Optimizer

**Location:** [`src/services/imageOptimizer.ts`](../src/services/imageOptimizer.ts)

### `optimizeImage(file, options)`

Client-side image optimization using Canvas API.

```typescript
interface OptimizeOptions {
  maxWidth?: number;   // Default: 800
  maxHeight?: number;  // Default: 400
  quality?: number;    // 0-1, Default: 0.85
  format?: 'webp' | 'jpeg' | 'png'; // Default: 'webp'
}

optimizeImage(file: File, options?: OptimizeOptions): Promise<File>
```

**Example:**

```typescript
import { optimizeImage } from "./services/imageOptimizer";

const optimized = await optimizeImage(originalFile, {
  maxWidth: 1200,
  quality: 0.8,
  format: "webp",
});
```

---

### `isValidImageFile(file)`

Validates if a file is a supported image type.

```typescript
isValidImageFile(file: File): boolean
```

**Supported types:** `image/jpeg`, `image/png`, `image/webp`, `image/gif`

---

### `getImageDimensions(file)`

Gets the natural dimensions of an image file.

```typescript
getImageDimensions(file: File): Promise<{ width: number; height: number }>
```

---

### `formatFileSize(bytes)`

Formats a byte count for human-readable display.

```typescript
formatFileSize(bytes: number): string
// formatFileSize(1536) → "1.5 KB"
```

---

## Storage Utilities

**Location:** [`src/services/storage.ts`](../src/services/storage.ts)

Safe wrappers for browser storage APIs with error handling.

### `getSessionStorage<T>(key)`

```typescript
getSessionStorage<T>(key: string): T | null
```

Retrieves and JSON-parses a value from sessionStorage.

---

### `getLocalStorage<T>(key)`

```typescript
getLocalStorage<T>(key: string): T | null
```

Retrieves and JSON-parses a value from localStorage.

---

### `getLocalStorageString(key, defaultValue)`

```typescript
getLocalStorageString(key: string, defaultValue?: string): string
```

Retrieves a raw string value from localStorage (no JSON parsing).

---

## TypeScript Interfaces

**Location:** [`src/types.ts`](../src/types.ts)

| Interface           | Database Table        | Description                           |
| ------------------- | --------------------- | ------------------------------------- |
| `PortfolioItem`     | `portfolio`           | Gallery images with layout options    |
| `BlogPost`          | `blog`                | Articles with rich text content       |
| `ServiceTier`       | `services`            | Pricing tiers with features           |
| `Comment`           | `comments`            | User comments on blog posts           |
| `Testimonial`       | `testimonials`        | Client reviews with ratings           |
| `ContactSubmission` | `contact_submissions` | Contact form entries                  |
| `Settings`          | `settings`            | Global site configuration (singleton) |
| `NavItem`           | —                     | Navigation menu items                 |

For full interface definitions, see [types.ts](../src/types.ts).
