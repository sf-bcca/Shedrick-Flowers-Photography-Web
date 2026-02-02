## 2025-02-14 - Misleading Interactive Cards
**Learning:** Several components (`BlogCard`, `PortfolioCard`) apply `cursor-pointer` to non-interactive `div` or `article` elements, creating a false affordance for keyboard users and screen readers who cannot focus or activate them.
**Action:** When touching these components, wrap them in proper `<a>` or `<button>` tags, or add `role="button"` with `tabIndex={0}` and keydown handlers.
