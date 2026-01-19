## 2024-05-22 - Form Character Counter Pattern
**Learning:** The application uses `block group` labels for form inputs. A clean pattern for adding character counts without disrupting the layout is to replace the label's `span` with a `flex justify-between` container, placing the count to the right of the label text.
**Action:** When adding character limits to other inputs (like in `Settings.tsx`), use this `flex justify-between` pattern inside the label to ensure consistent alignment and spacing.
