// notifications.js - Browser notification management
// Handles permission requests and notification triggers

/**
 * Notification Manager
 * Manages browser notifications for health reminders
 */
const NotificationManager = {
  
  /**
   * Check if notifications are supported
   */
  isSupported() {
    return 'Notification' in window;
  },
  
  /**
   * Check current permission status
   */
  getPermissionStatus() {
    if (!this.isSupported()) return 'unsupported';
    return Notification.permission;
  },
  
  /**
   * Request notification permission
   */
  async requestPermission() {
    if (!this.isSupported()) {
      console.warn('[Notifications] Not supported in this browser');
      return false;
    }
    
    if (Notification.permission === 'granted') {
      console.log('[Notifications] Permission already granted');
      return true;
    }
    
    try {
      const permission = await Notification.requestPermission();
      console.log('[Notifications] Permission:', permission);
      return permission === 'granted';
    } catch (error) {
      console.error('[Notifications] Permission request failed:', error);
      return false;
    }
  },
  
  /**
   * Show a notification
   */
  show(title, options = {}) {
    if (!this.isSupported()) {
      console.warn('[Notifications] Not supported');
      return null;
    }
    
    if (Notification.permission !== 'granted') {
      console.warn('[Notifications] Permission not granted');
      return null;
    }
    
    const defaultOptions = {
      icon: '/assets/images/icon-192x192.png',
      badge: '/assets/images/icon-72x72.png',
      vibrate: [200, 100, 200],
      tag: 'health-tracker',
      requireInteraction: false,
      ...options
    };
    
    try {
      const notification = new Notification(title, defaultOptions);
      
      // Auto-close after 5 seconds
      setTimeout(() => notification.close(), 5000);
      
      return notification;
    } catch (error) {
      console.error('[Notifications] Failed to show notification:', error);
      return null;
    }
  },
  
  /**
   * Show health reminder notification
   */
  showHealthReminder() {
    return this.show('Health Tracker Reminder', {
      body: 'Time to log your health data for today!',
      icon: '/assets/images/icon-192x192.png',
      tag: 'daily-reminder'
    });
  },
  
  /**
   * Show goal achievement notification
   */
  showGoalAchievement(goalName) {
    return this.show('Goal Achieved! 🎉', {
      body: `Congratulations! You reached your ${goalName} goal!`,
      icon: '/assets/images/icon-192x192.png',
      tag: 'goal-achievement'
    });
  },
  
  /**
   * Show health alert notification
   */
  showHealthAlert(message) {
    return this.show('Health Alert ⚠️', {
      body: message,
      icon: '/assets/images/icon-192x192.png',
      tag: 'health-alert',
      requireInteraction: true
    });
  },
  
  /**
   * Schedule daily reminder
   */
  scheduleDailyReminder(time = '09:00') {
    if (!this.isSupported() || Notification.permission !== 'granted') {
      console.warn('[Notifications] Cannot schedule reminder');
      return false;
    }
    
    // Parse time (HH:MM format)
    const [hours, minutes] = time.split(':').map(Number);
    
    // Calculate milliseconds until next reminder
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);
    
    // If time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }
    
    const msUntilReminder = scheduledTime - now;
    
    console.log(`[Notifications] Daily reminder scheduled for ${scheduledTime.toLocaleString()}`);
    
    // Set timeout for the reminder
    setTimeout(() => {
      this.showHealthReminder();
      // Reschedule for next day
      this.scheduleDailyReminder(time);
    }, msUntilReminder);
    
    return true;
  },
  
  /**
   * Check and notify about goals
   */
  checkGoals(entry, goals) {
    if (!entry || !goals) return;
    
    // Check step goal
    if (entry.steps >= goals.steps) {
      this.showGoalAchievement('daily steps');
    }
    
    // Check water goal
    if (entry.water >= goals.water) {
      this.showGoalAchievement('water intake');
    }
    
    // Check sleep goal
    if (entry.sleep >= goals.sleep) {
      this.showGoalAchievement('sleep');
    }
  },
  
  /**
   * Check health flags and send alerts
   */
  checkHealthFlags(entry, goals) {
    if (!entry) return;
    
    const alerts = [];
    
    // Low sleep alert
    if (entry.sleep < 6) {
      alerts.push('You got less than 6 hours of sleep. Consider resting more.');
    }
    
    // High heart rate alert
    if (entry.heartRate > 100) {
      alerts.push('Your heart rate is elevated. Consider consulting a doctor if this persists.');
    }
    
    // Low water intake
    if (entry.water < 3) {
      alerts.push('Low water intake detected. Stay hydrated!');
    }
    
    // Low activity
    if (entry.steps < 2000) {
      alerts.push('Very low activity today. Try to get some movement in.');
    }
    
    // Send alerts
    alerts.forEach(alert => {
      this.showHealthAlert(alert);
    });
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NotificationManager;
}
