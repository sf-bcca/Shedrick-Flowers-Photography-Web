# Sentinel Journal

This journal tracks CRITICAL security learnings, vulnerability patterns, and architectural gaps found in the codebase.

## 2024-05-22 - [Sentinel Initialized]
**Vulnerability:** N/A
**Learning:** Initialized Sentinel security journal.
**Prevention:** N/A

## 2024-05-22 - [Stored XSS in Settings]
**Vulnerability:** Settings input for social links accepted any string, including `javascript:` URIs, allowing Stored XSS in the global Footer.
**Learning:** React renders `href` attributes as-is; always validate protocol (http/https) for user-provided URLs.
**Prevention:** Implemented centralized `isValidUrl` check and enforced it on all link inputs.

## 2024-05-24 - [Edge Function Info Leak]
**Vulnerability:** The `gemini-chat` Edge Function returned raw `error.message` to the client in the `catch` block, potentially exposing stack traces or upstream API error details (e.g., from Gemini or Supabase).
**Learning:** Even in serverless/edge functions, default error handling often favors debuggability over security; "Fail Securely" requires explicit generic error responses.
**Prevention:** Updated the global `catch` block to log the specific error to the console but return a generic "Internal Server Error" (HTTP 500) to the client.

## 2024-05-24 - [Reverse Tabnabbing in Blog]
**Vulnerability:** Blog content rendered via `dangerouslySetInnerHTML` allowed `target="_blank"` links without `rel="noopener noreferrer"`.
**Learning:** `DOMPurify` sanitizes XSS but does not enforce `rel` attributes by default. Links opening in new tabs can expose the parent window object to malicious pages.
**Prevention:** Implemented a centralized `sanitizeHtml` utility with a `DOMPurify` hook to strictly enforce `rel="noopener noreferrer"` on all external links, and configured Tiptap to add it by default.

## 2025-02-14 - [Edge Function DoS & CORS]
**Vulnerability:** The `gemini-chat` Edge Function lacked input validation (allowing DoS/cost injection) and had an overly permissive CORS policy (`Access-Control-Allow-Origin: *`).
**Learning:** Serverless functions often default to "open" configurations for developer ease, but this exposes APIs to abuse and unauthorized usage in production. Always validate input size and type before processing, especially for AI APIs with associated costs.
**Prevention:** Implemented strict input validation (max 20 messages, max 2000 chars/msg) and made CORS origin configurable via `ALLOWED_ORIGIN` env var.
