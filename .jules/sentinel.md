## 2025-12-14 - Exposed AI API Key in Client-Side Architecture
**Vulnerability:** The Gemini API key is embedded in the client-side JavaScript bundle and exposed to anyone inspecting the source code or network traffic.
**Learning:** Client-only architectures cannot safely hold secrets for third-party APIs unless those APIs support scoped/restricted browser keys (like Firebase or Google Maps). GenAI keys typically allow content generation which can be abused or quota-drained if exposed.
**Prevention:** Use a backend proxy (e.g., Supabase Edge Function) to hold the secret key and proxy requests from the client. Alternatively, use API keys with strict quotas and HTTP Referrer restrictions if the provider supports them.
