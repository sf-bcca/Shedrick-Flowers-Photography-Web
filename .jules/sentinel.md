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

## 2024-05-24 - [DoS and Cost Injection in Edge Function]
**Vulnerability:** The `gemini-chat` Edge Function blindly accepted any JSON structure in the `messages` array, allowing attackers to send unlimited or massive messages, leading to Potential Denial of Service (DoS) and API cost exhaustion.
**Learning:** Serverless functions that proxy paid APIs must strictly validate input size and structure *before* processing or calling upstream services.
**Prevention:** Implemented strict input validation for `messages` array (must be array, max 20 items) and message content (max 1000 chars, valid role) to mitigate these risks.
