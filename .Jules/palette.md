## 2025-02-14 - Semantic Navigation vs Buttons
**Learning:** This codebase frequently uses `<button onClick={navigate}>` for primary Calls to Action (CTAs) instead of semantic `<Link>` components. This prevents "Open in new tab" functionality and reduces accessibility.
**Action:** When working on navigation elements, check if they are buttons and convert them to Links while preserving button styling classes.
