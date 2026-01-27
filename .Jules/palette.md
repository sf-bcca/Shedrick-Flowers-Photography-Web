## 2025-02-18 - [Semantic HTML in Form Labels]
**Learning:** `div` inside `label` is invalid HTML, but often renders correctly. However, specifically in React/Tailwind contexts, replacing it with `span` + `flex` maintains the layout while ensuring semantic validity.
**Action:** Always check `label` children for block-level elements like `div` and convert them to `span` with flex/block classes.
