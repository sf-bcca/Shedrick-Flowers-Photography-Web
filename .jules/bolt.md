# Bolt's Journal

## 2024-05-24 - [BlurImage Optimization]
**Learning:** `BlurImage` component was using `useEffect` to derive `lowResSrc` from `src`, causing an immediate second render on every mount. It also lacked `React.memo` and had a potential flash of stale state when `src` changed because `isLoaded` reset was asynchronous (useEffect).
**Action:** Always derive state during render if possible (or use `useMemo`). Use the `prevProps` state pattern to reset state synchronously when props change.

## 2024-05-24 - [Lockfile Pollution]
**Learning:** `npm install` can modify `package-lock.json` with environmental differences (e.g. peer deps resolution).
**Action:** Always revert `package-lock.json` if no dependencies were added/removed in `package.json`, to keep the PR clean.

## 2024-05-24 - [Static Data Caching]
**Learning:** This application heavily utilizes `sessionStorage` for data that changes infrequently (e.g., Portfolio, Services) to simulate a "static site" feel while still using a dynamic CMS. This pattern significantly improves navigation speed within a session but requires careful manual implementation in each component.
**Action:** When working on "Manager" or "Page" components that fetch generic content, always check `sessionStorage` patterns first before optimizing the fetch itself.

## 2024-05-24 - [Lazy State Initialization]
**Learning:** `useState(localStorage.getItem('key'))` executes `getItem` on every render, causing synchronous blocking even if the result is ignored after mount.
**Action:** Use `useState(() => localStorage.getItem('key'))` to ensure the initializer only runs during the first render.
