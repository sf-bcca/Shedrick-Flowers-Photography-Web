
/**
 * Safe wrapper for sessionStorage.getItem that handles JSON parsing and errors.
 * @param key The key to retrieve from sessionStorage.
 * @returns The parsed value or null if not found/invalid.
 */
export const getSessionStorage = <T>(key: string): T | null => {
    try {
        const item = sessionStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.warn(`Error reading ${key} from sessionStorage:`, error);
        return null;
    }
};

/**
 * Safe wrapper for localStorage.getItem that handles JSON parsing and errors.
 * @param key The key to retrieve from localStorage.
 * @returns The parsed value or null if not found/invalid.
 */
export const getLocalStorage = <T>(key: string): T | null => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.warn(`Error reading ${key} from localStorage:`, error);
        return null;
    }
};

/**
 * Safe wrapper for localStorage.getItem for simple string values (no JSON parse).
 * @param key The key to retrieve from localStorage.
 * @param defaultValue The default value if not found.
 * @returns The value or defaultValue.
 */
export const getLocalStorageString = (key: string, defaultValue: string = ''): string => {
    try {
        return localStorage.getItem(key) || defaultValue;
    } catch (error) {
        console.warn(`Error reading ${key} from localStorage:`, error);
        return defaultValue;
    }
};
