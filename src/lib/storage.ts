/**
 * Robust localStorage wrapper with fallback to in-memory storage
 * Handles cases where localStorage is unavailable or throws errors
 */

// In-memory fallback storage
const memoryStorage: Map<string, string> = new Map();
let useMemoryFallback = false;

/**
 * Check if localStorage is available and working
 */
function isLocalStorageAvailable(): boolean {
    if (useMemoryFallback) return false;
    
    try {
        const testKey = "__storage_test__";
        window.localStorage.setItem(testKey, testKey);
        window.localStorage.removeItem(testKey);
        return true;
    } catch {
        useMemoryFallback = true;
        console.warn("localStorage is not available, using in-memory fallback");
        return false;
    }
}

/**
 * Retry wrapper for storage operations
 */
function withRetry<T>(
    operation: () => T,
    maxRetries: number = 3,
    delay: number = 100
): T {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return operation();
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            
            // Only retry on transient errors
            if (attempt < maxRetries - 1) {
                // Synchronous delay for simplicity (storage ops are fast)
                const start = Date.now();
                while (Date.now() - start < delay) {
                    // Busy wait
                }
            }
        }
    }
    
    throw lastError;
}

/**
 * Safely get an item from storage
 */
export function getItem(key: string): string | null {
    try {
        if (isLocalStorageAvailable()) {
            return withRetry(() => localStorage.getItem(key));
        }
        return memoryStorage.get(key) ?? null;
    } catch (error) {
        console.error(`Failed to get item "${key}" from storage:`, error);
        // Try memory fallback
        return memoryStorage.get(key) ?? null;
    }
}

/**
 * Safely set an item in storage
 */
export function setItem(key: string, value: string): boolean {
    try {
        if (isLocalStorageAvailable()) {
            withRetry(() => localStorage.setItem(key, value));
        }
        // Always store in memory as backup
        memoryStorage.set(key, value);
        return true;
    } catch (error) {
        console.error(`Failed to set item "${key}" in storage:`, error);
        // Fallback to memory only
        memoryStorage.set(key, value);
        useMemoryFallback = true;
        return false;
    }
}

/**
 * Safely remove an item from storage
 */
export function removeItem(key: string): boolean {
    try {
        if (isLocalStorageAvailable()) {
            withRetry(() => localStorage.removeItem(key));
        }
        memoryStorage.delete(key);
        return true;
    } catch (error) {
        console.error(`Failed to remove item "${key}" from storage:`, error);
        memoryStorage.delete(key);
        return false;
    }
}

/**
 * Type-safe JSON storage operations
 */
export function getJSON<T>(key: string, defaultValue: T): T {
    try {
        const item = getItem(key);
        if (item === null) return defaultValue;
        return JSON.parse(item) as T;
    } catch (error) {
        console.error(`Failed to parse JSON for key "${key}":`, error);
        return defaultValue;
    }
}

export function setJSON<T>(key: string, value: T): boolean {
    try {
        const json = JSON.stringify(value);
        return setItem(key, json);
    } catch (error) {
        console.error(`Failed to stringify JSON for key "${key}":`, error);
        return false;
    }
}

/**
 * Check if storage is using memory fallback
 */
export function isUsingFallback(): boolean {
    return useMemoryFallback;
}

/**
 * Clear all stored data
 */
export function clear(): boolean {
    try {
        if (isLocalStorageAvailable()) {
            localStorage.clear();
        }
        memoryStorage.clear();
        return true;
    } catch (error) {
        console.error("Failed to clear storage:", error);
        memoryStorage.clear();
        return false;
    }
}
