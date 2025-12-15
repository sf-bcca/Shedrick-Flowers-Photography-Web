## 2025-12-14 - Accessible Icon Buttons
**Learning:** Icon-only buttons (like in toolbars or media pickers) are a common accessibility gap in this codebase. They often rely on `title` or visual context but lack accessible names for screen readers.
**Action:** Always add `aria-label` to icon-only buttons, matching the `title` if present, or describing the action (e.g., "Close media picker") if no text is visible.

## 2025-12-15 - Responsive Button Labels
**Learning:** Buttons that hide text labels on mobile (using classes like `hidden sm:inline`) become effectively "icon-only" on small screens. Without an `aria-label`, screen readers may announce nothing or just "button", confusing mobile users.
**Action:** Add static `aria-label` attributes to any button that uses responsive classes to hide its text content, ensuring consistent accessibility across all viewports.
