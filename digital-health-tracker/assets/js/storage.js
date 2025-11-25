// storage.js - LocalStorage management for Digital Health Tracker
// Handles all data persistence operations

/**
 * Storage Manager
 * Provides a clean API for interacting with localStorage
 */
const StorageManager = {
  STORAGE_KEY: 'healthTrackerData',
  
  /**
   * Initialize storage with default data if empty
   */
  async init() {
    if (!this.hasData()) {
      console.log('[Storage] No existing data found, loading defaults...');
      await this.loadDefaultData();
    }
    console.log('[Storage] Initialized successfully');
  },
  
  /**
   * Check if storage has data
   */
  hasData() {
    return localStorage.getItem(this.STORAGE_KEY) !== null;
  },
  
  /**
   * Load default data from JSON file
   */
  async loadDefaultData() {
    try {
      const response = await fetch('/data/default.json');
      const defaultData = await response.json();
      this.saveAll(defaultData);
      console.log('[Storage] Default data loaded successfully');
      return true;
    } catch (error) {
      console.error('[Storage] Failed to load default data:', error);
      // Initialize with minimal structure
      this.saveAll({
        user: {},
        goals: {},
        settings: { theme: 'light', notifications: true },
        entries: []
      });
      return false;
    }
  },
  
  /**
   * Get all data
   */
  getAll() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('[Storage] Failed to parse data:', error);
      return null;
    }
  },
  
  /**
   * Save all data
   */
  saveAll(data) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('[Storage] Failed to save data:', error);
      return false;
    }
  },
  
  /**
   * Get user profile
   */
  getUserProfile() {
    const data = this.getAll();
    return data?.user || {};
  },
  
  /**
   * Update user profile
   */
  updateUserProfile(userData) {
    const data = this.getAll();
    data.user = { ...data.user, ...userData };
    return this.saveAll(data);
  },
  
  /**
   * Get goals
   */
  getGoals() {
    const data = this.getAll();
    return data?.goals || {};
  },
  
  /**
   * Update goals
   */
  updateGoals(goals) {
    const data = this.getAll();
    data.goals = { ...data.goals, ...goals };
    return this.saveAll(data);
  },
  
  /**
   * Get settings
   */
  getSettings() {
    const data = this.getAll();
    return data?.settings || { theme: 'light', notifications: true };
  },
  
  /**
   * Update settings
   */
  updateSettings(settings) {
    const data = this.getAll();
    data.settings = { ...data.settings, ...settings };
    return this.saveAll(data);
  },
  
  /**
   * Get all health entries
   */
  getEntries() {
    const data = this.getAll();
    return data?.entries || [];
  },
  
  /**
   * Get entry by date
   */
  getEntryByDate(date) {
    const entries = this.getEntries();
    return entries.find(entry => entry.date === date);
  },
  
  /**
   * Add or update health entry
   */
  saveEntry(entry) {
    const data = this.getAll();
    const entries = data.entries || [];
    
    // Check if entry for this date exists
    const index = entries.findIndex(e => e.date === entry.date);
    
    if (index >= 0) {
      // Update existing entry
      entries[index] = { ...entries[index], ...entry };
    } else {
      // Add new entry
      entries.push(entry);
    }
    
    // Sort by date (newest first)
    entries.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    data.entries = entries;
    return this.saveAll(data);
  },
  
  /**
   * Delete entry by date
   */
  deleteEntry(date) {
    const data = this.getAll();
    data.entries = data.entries.filter(entry => entry.date !== date);
    return this.saveAll(data);
  },
  
  /**
   * Get entries for date range
   */
  getEntriesInRange(startDate, endDate) {
    const entries = this.getEntries();
    return entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= new Date(startDate) && entryDate <= new Date(endDate);
    });
  },
  
  /**
   * Get last N days of entries
   */
  getLastNDays(days) {
    const entries = this.getEntries();
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= startDate && entryDate <= endDate;
    }).slice(0, days);
  },
  
  /**
   * Get current week entries
   */
  getCurrentWeekEntries() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    
    return this.getEntriesInRange(startOfWeek.toISOString().split('T')[0], today.toISOString().split('T')[0]);
  },
  
  /**
   * Get current month entries
   */
  getCurrentMonthEntries() {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    return this.getEntriesInRange(startOfMonth.toISOString().split('T')[0], today.toISOString().split('T')[0]);
  },
  
  /**
   * Export data as JSON
   */
  exportJSON() {
    const data = this.getAll();
    return JSON.stringify(data, null, 2);
  },
  
  /**
   * Import data from JSON
   */
  importJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      // Validate basic structure
      if (!data.entries || !Array.isArray(data.entries)) {
        throw new Error('Invalid data format');
      }
      this.saveAll(data);
      return { success: true, message: 'Data imported successfully' };
    } catch (error) {
      console.error('[Storage] Import failed:', error);
      return { success: false, message: error.message };
    }
  },
  
  /**
   * Clear all data (use with caution)
   */
  clearAll() {
    localStorage.removeItem(this.STORAGE_KEY);
    console.log('[Storage] All data cleared');
  },
  
  /**
   * Get storage size in bytes
   */
  getStorageSize() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? new Blob([data]).size : 0;
  }
};

// Expose to window
window.StorageManager = StorageManager;

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StorageManager;
}
