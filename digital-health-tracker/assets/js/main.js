// main.js - Core application logic
// Initializes app, manages themes, and provides utility functions

/**
 * Main Application Manager
 * Coordinates all modules and provides core functionality
 */
const App = {
  /**
   * Initialize the application
   */
  async init() {
    console.log('[App] Initializing Digital Health Tracker...');
    
    // Initialize storage
    await StorageManager.init();
    
    // Apply theme
    this.applyTheme();
    
    // Register service worker
    this.registerServiceWorker();
    
    // Setup notification permissions if enabled
    const settings = StorageManager.getSettings();
    if (settings.notifications) {
      await NotificationManager.requestPermission();
      if (settings.reminderTime) {
        NotificationManager.scheduleDailyReminder(settings.reminderTime);
      }
    }
    
    console.log('[App] Initialization complete');
  },
  
  /**
   * Register service worker for PWA
   */
  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('[App] Service Worker registered:', registration.scope);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.showUpdateNotification();
            }
          });
        });
      } catch (error) {
        console.error('[App] Service Worker registration failed:', error);
      }
    }
  },
  
  /**
   * Show update notification when new SW is available
   */
  showUpdateNotification() {
    this.showToast('A new version is available! Refresh to update.', 'info', 10000);
  },
  
  /**
   * Apply theme based on settings
   */
  applyTheme() {
    const settings = StorageManager.getSettings();
    const theme = settings.theme || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    console.log('[App] Theme applied:', theme);
  },
  
  /**
   * Toggle theme
   */
  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    StorageManager.updateSettings({ theme: newTheme });
    
    this.showToast(`Switched to ${newTheme} mode`, 'success');
  },
  
  /**
   * Show toast notification
   */
  showToast(message, type = 'info', duration = 3000) {
    // Create toast container if it doesn't exist
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    // Add to container
    container.appendChild(toast);
    
    // Remove after duration
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        container.removeChild(toast);
        if (container.children.length === 0) {
          document.body.removeChild(container);
        }
      }, 300);
    }, duration);
  },
  
  /**
   * Format date to YYYY-MM-DD
   */
  formatDate(date) {
    const d = date instanceof Date ? date : new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },
  
  /**
   * Get today's date in YYYY-MM-DD format
   */
  getTodayDate() {
    return this.formatDate(new Date());
  },
  
  /**
   * Parse date string to Date object
   */
  parseDate(dateString) {
    return new Date(dateString);
  },
  
  /**
   * Show modal
   */
  showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
    }
  },
  
  /**
   * Hide modal
   */
  hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
    }
  },
  
  /**
   * Validate email format
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  /**
   * Debounce function
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  /**
   * Navigate to page
   */
  navigateTo(page) {
    window.location.href = page;
  },
  
  /**
   * Check if user is onboarded
   */
  isOnboarded() {
    const user = StorageManager.getUserProfile();
    return user && user.name && user.email;
  },
  
  /**
   * Logout / Clear session (keeps data, resets to login)
   */
  logout() {
    // Just navigate to login, data persists
    this.navigateTo('index.html');
  }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}

// Expose to window
window.App = App;

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = App;
}
