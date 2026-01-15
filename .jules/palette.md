## 2024-05-24 - Hiding Decorative Icon Text

**Learning:** This application uses `material-symbols-outlined` in `span` elements that contain the icon name as text. This pattern requires `aria-hidden="true"` to prevent screen readers from reading the icon name (e.g., "person", "check_circle") which is often redundant or confusing.
**Action:** Always add `aria-hidden="true"` to decorative icon elements, especially those using ligature-based icon fonts where the icon name is the text content.

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

## 2025-12-18 - Accessible Chat Interface

**Learning:** Floating chat widgets need explicit state management for screen readers. A simple toggle isn't enough; the hidden window must be removed from the accessibility tree (using `invisible` or `hidden`) to prevent focus trapping, and the toggle button needs `aria-expanded`.
**Action:** When implementing toggleable widgets, pair `aria-expanded` on the trigger with `aria-hidden` and `invisible`/`hidden` classes on the content container. Also, use `role="log"` and `aria-live="polite"` for dynamic message feeds.

## 2025-12-19 - Unified Loading States

**Learning:** Inconsistent loading indicators (mix of hardcoded spinners and text) create a disjointed experience. More importantly, visual-only spinners (divs) are invisible to screen readers, leaving users unsure if content is loading or the page is broken.
**Action:** Use a standardized `LoadingSpinner` component that includes `role="status"` and a screen-reader-only label (e.g., "Loading..."). Ensure it handles both full-screen and inline contexts.

## 2025-12-20 - Semantic Context in Lists

**Learning:** In lists of items (like a media gallery), generic action labels ("Delete", "Copy") are confusing for screen reader users as they hear the same label repeatedly.
**Action:** Always include the item's unique identifier (e.g., filename or title) in the `aria-label` (e.g., "Delete image.jpg") to provide context, even if the visible label is generic or an icon.

## 2025-12-21 - Semantic Buttons for Interactions

**Learning:** Using `div`s with `onClick` handlers for interactive elements (like "scroll down" arrows) creates barriers for keyboard and screen reader users. These elements are not focusable and lack semantic meaning.
**Action:** Always replace interactive `div`s with semantic `<button>` elements. Use `bg-transparent border-none` to reset styles if needed, and ensure `aria-label` is provided for icon-only buttons.

## 2025-12-22 - Visible Focus for Hover Actions

**Learning:** Interactive elements hidden by opacity (e.g., "reveal on hover" actions) create an "invisible focus" trap for keyboard users, who can tab to the buttons but cannot see them.
**Action:** Always add `focus-within:opacity-100` to the container of any interactive elements that use `opacity-0 group-hover:opacity-100`, ensuring they become visible when they receive keyboard focus.
