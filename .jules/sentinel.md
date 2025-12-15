## 2025-12-14 - Exposed AI API Key in Client-Side Architecture
**Vulnerability:** The Gemini API key is embedded in the client-side JavaScript bundle and exposed to anyone inspecting the source code or network traffic.
**Learning:** Client-only architectures cannot safely hold secrets for third-party APIs unless those APIs support scoped/restricted browser keys (like Firebase or Google Maps). GenAI keys typically allow content generation which can be abused or quota-drained if exposed.
**Prevention:** Use a backend proxy (e.g., Supabase Edge Function) to hold the secret key and proxy requests from the client. Alternatively, use API keys with strict quotas and HTTP Referrer restrictions if the provider supports them.

## 2025-12-15 - Stored XSS in Rich Text Content
**Vulnerability:** Blog content was rendered using `dangerouslySetInnerHTML` without sanitization. Although primarily authored by admins, a compromised admin account or database injection could lead to Stored XSS affecting all visitors.
**Learning:** Trusting "internal" content is risky. Rich text editors often produce HTML that *looks* safe but relies on the rendering component to strip malicious scripts.
**Prevention:** Always sanitize HTML content immediately before rendering using a library like `dompurify`, even if the source is considered trusted.
