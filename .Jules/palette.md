# Palette's Journal

## 2025-02-14 - HashRouter Navigation
**Learning:** This application uses `HashRouter`, meaning all internal links render with a `#/` prefix in the DOM (e.g., `#/contact`), while React Router's `useLocation` still returns the clean path (e.g., `/contact`).
**Action:** When verifying links with Playwright, always expect `href` attributes to start with `#/`. When implementing `aria-current`, rely on `useLocation` as it abstracts this detail away.
