## 2025-12-14 - Accessible Icon Buttons
**Learning:** Icon-only buttons (like in toolbars or media pickers) are a common accessibility gap in this codebase. They often rely on `title` or visual context but lack accessible names for screen readers.
**Action:** Always add `aria-label` to icon-only buttons, matching the `title` if present, or describing the action (e.g., "Close media picker") if no text is visible.
