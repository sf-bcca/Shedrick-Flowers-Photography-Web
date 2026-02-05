## 2024-05-23 - Form Label Layouts with Metadata
**Learning:** When adding metadata (like character counts) to form labels, wrapping the label text and the metadata in a `div` with `flex justify-between` ensures consistent alignment and readability without breaking the `label` association.
**Action:** Use this pattern for all future inputs requiring metadata: `<div className="flex justify-between"><span>Label</span><span>Meta</span></div>`.
