# Bolt's Journal

## 2024-05-24 - [BlurImage Optimization]
**Learning:** `BlurImage` component was using `useEffect` to derive `lowResSrc` from `src`, causing an immediate second render on every mount. It also lacked `React.memo` and had a potential flash of stale state when `src` changed because `isLoaded` reset was asynchronous (useEffect).
**Action:** Always derive state during render if possible (or use `useMemo`). Use the `prevProps` state pattern to reset state synchronously when props change.

## 2024-05-24 - [Lockfile Pollution]
**Learning:** `npm install` can modify `package-lock.json` with environmental differences (e.g. peer deps resolution).
**Action:** Always revert `package-lock.json` if no dependencies were added/removed in `package.json`, to keep the PR clean.
