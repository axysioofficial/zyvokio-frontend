const HISTORY_STORAGE_KEY = 'picmorph_conversion_history_v1';
const PREFERENCES_STORAGE_KEY = 'picmorph_user_preferences_v1';

const DEFAULT_PREFERENCES = {
  compressionLevel: 8,
  quality: 100,
  autoDownload: true,
  viewMode: 'grid', // 'grid' | 'table'
  soundEnabled: true
};

/**
 * Retrieve conversion history from browser localStorage
 * @returns {Array} List of conversion records
 */
export function getConversionHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to read conversion history from localStorage:', err);
    return [];
  }
}

/**
 * Save a new conversion record to localStorage
 * @param {object} record 
 * @returns {Array} Updated history array
 */
export function addConversionRecord(record) {
  try {
    const existing = getConversionHistory();
    // Keep max 50 items to avoid localStorage quota limits
    const updated = [record, ...existing].slice(0, 50);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save record to localStorage:', err);
    return getConversionHistory();
  }
}

/**
 * Delete a single conversion record by ID
 * @param {string} id 
 * @returns {Array} Updated history array
 */
export function deleteConversionRecord(id) {
  try {
    const existing = getConversionHistory();
    const updated = existing.filter(item => item.id !== id);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete conversion record:', err);
    return getConversionHistory();
  }
}

/**
 * Clear all conversion history from localStorage
 */
export function clearAllHistory() {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear history from localStorage:', err);
  }
}

/**
 * Retrieve user preferences from localStorage
 * @returns {object}
 */
export function getUserPreferences() {
  try {
    const raw = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Failed to read preferences:', err);
    return DEFAULT_PREFERENCES;
  }
}

/**
 * Save updated user preferences to localStorage
 * @param {object} prefs 
 */
export function saveUserPreferences(prefs) {
  try {
    const current = getUserPreferences();
    const merged = { ...current, ...prefs };
    localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(merged));
    return merged;
  } catch (err) {
    console.error('Failed to save preferences:', err);
    return DEFAULT_PREFERENCES;
  }
}

/**
 * Format bytes into human readable format (KB, MB)
 * @param {number} bytes 
 * @param {number} decimals 
 * @returns {string}
 */
export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
