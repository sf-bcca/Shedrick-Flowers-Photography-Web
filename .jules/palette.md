## 2024-05-24 - Hiding Decorative Icon Text
**Learning:** This application uses `material-symbols-outlined` in `span` elements that contain the icon name as text. This pattern requires `aria-hidden="true"` to prevent screen readers from reading the icon name (e.g., "person", "check_circle") which is often redundant or confusing.
**Action:** Always add `aria-hidden="true"` to decorative icon elements, especially those using ligature-based icon fonts where the icon name is the text content.
