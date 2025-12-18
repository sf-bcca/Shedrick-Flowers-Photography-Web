## 2025-12-14 - Accessible Icon Buttons
**Learning:** Icon-only buttons (like in toolbars or media pickers) are a common accessibility gap in this codebase. They often rely on `title` or visual context but lack accessible names for screen readers.
**Action:** Always add `aria-label` to icon-only buttons, matching the `title` if present, or describing the action (e.g., "Close media picker") if no text is visible.

## 2025-12-15 - Responsive Button Labels
**Learning:** Buttons that hide text labels on mobile (using classes like `hidden sm:inline`) become effectively "icon-only" on small screens. Without an `aria-label`, screen readers may announce nothing or just "button", confusing mobile users.
**Action:** Add static `aria-label` attributes to any button that uses responsive classes to hide its text content, ensuring consistent accessibility across all viewports.

## 2025-12-16 - Semantic Action Labels
**Learning:** Generic "Edit" or "Delete" labels on icon buttons are okay, but including the item name (e.g., "Edit Wedding Photography") provides much better context for screen reader users navigating lists.
**Action:** When adding `aria-label` to action buttons in a list, dynamically include the item's name or title to distinguish between multiple similar actions.

## 2025-12-17 - Skip Links
**Learning:** A "Skip to content" link is essential for keyboard users to bypass repeated navigation blocks. It should be hidden by default but visible on focus, and link to the main content area which needs `id` and `tabIndex="-1"`.
**Action:** Include a skip link as the first element in the layout component, styled with `sr-only focus:not-sr-only`, and ensure the target element is focusable.
