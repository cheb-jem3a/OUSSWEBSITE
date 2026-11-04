// Utility for managing browser-extracted canvas thumbnails in localStorage & memory cache

const STORAGE_PREFIX = 'portfolio_thumb_';
const EVENT_NAME = 'portfolio_thumbnail_updated';

// In-memory cache for fast synchronous access
const memoryCache: Record<string, string> = {};

// Initialize cache from localStorage
if (typeof window !== 'undefined') {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        const projectId = key.substring(STORAGE_PREFIX.length);
        const dataUrl = localStorage.getItem(key);
        if (dataUrl) {
          memoryCache[projectId] = dataUrl;
        }
      }
    }
  } catch {
    // Ignore storage access errors
  }
}

/**
 * Get stored thumbnail data URL for a project
 */
export function getStoredThumbnail(projectId: string): string | null {
  if (memoryCache[projectId]) {
    return memoryCache[projectId];
  }
  if (typeof window === 'undefined') return null;

  try {
    const val = localStorage.getItem(STORAGE_PREFIX + projectId);
    if (val) {
      memoryCache[projectId] = val;
      return val;
    }
  } catch {
    // Ignore
  }
  return null;
}

/**
 * Save thumbnail data URL for a project
 */
export function saveStoredThumbnail(projectId: string, dataUrl: string): void {
  memoryCache[projectId] = dataUrl;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_PREFIX + projectId, dataUrl);
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { projectId, dataUrl } }));
    } catch (e) {
      console.warn('localStorage quota reached or unavailable:', e);
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { projectId, dataUrl } }));
    }
  }
}

/**
 * Subscribe to thumbnail updates
 */
export function subscribeThumbnails(callback: (projectId?: string) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handler = (e: Event) => {
    const custom = e as CustomEvent<{ projectId?: string }>;
    callback(custom.detail?.projectId);
  };

  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}

/**
 * Get all stored thumbnails as a key-value map
 */
export function getAllStoredThumbnails(): Record<string, string> {
  const result: Record<string, string> = { ...memoryCache };
  if (typeof window !== 'undefined') {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_PREFIX)) {
          const id = key.substring(STORAGE_PREFIX.length);
          const val = localStorage.getItem(key);
          if (val) result[id] = val;
        }
      }
    } catch {
      // Ignore
    }
  }
  return result;
}

/**
 * Clear all stored thumbnails
 */
export function clearStoredThumbnails(): void {
  Object.keys(memoryCache).forEach((k) => delete memoryCache[k]);
  if (typeof window !== 'undefined') {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
      window.dispatchEvent(new CustomEvent(EVENT_NAME));
    } catch {
      // Ignore
    }
  }
}

/**
 * Download thumbnails.json file
 */
export function downloadThumbnailsJSON(): void {
  const all = getAllStoredThumbnails();
  const blob = new Blob([JSON.stringify(all, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `portfolio-thumbnails-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
