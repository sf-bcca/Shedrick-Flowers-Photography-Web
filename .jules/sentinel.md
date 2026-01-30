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

## 2024-06-12 - [Broken Access Control via Google Auth]
**Vulnerability:** Supabase OAuth (Google) allows any user to sign up/login and become "authenticated". The frontend logic only checked for the existence of a user session, allowing unauthorized users to access Admin Routes.
**Learning:** "Authenticated" != "Authorized". In a single-user application using public OAuth providers, strictly checking for the user's identity (e.g., email allowlist) is critical to prevent accidental privilege escalation.
**Prevention:** Implemented an Email Allowlist in `AuthContext` and `ProtectedRoute`. Added `VITE_ADMIN_EMAIL` env var support. Note: Maintained a hardcoded fallback to the owner's email to prevent lockout during migration, highlighting the trade-off between "Secure by Default" and "Availability".
