// Authentication System - Email/Password Login with Database
// Secure user authentication and session management

class AuthSystem {
  constructor() {
    this.currentUser = null;
    this.sessionKey = 'healthTracker_session';
    this.usersKey = 'healthTracker_users';
    this.initialized = false;
  }

  /**
   * Initialize authentication system
   */
  init() {
    if (this.initialized) return;
    
    // Create default admin user if no users exist
    this.initializeDefaultUsers();
    
    // Check for existing session
    this.loadSession();
    
    this.initialized = true;
    console.log('[AuthSystem] Initialized');
  }

  /**
   * Initialize default users including sample student
   */
  initializeDefaultUsers() {
    const users = this.getAllUsers();
    
    if (users.length === 0) {
      // Sample 22-year-old student data
      const sampleStudent = {
        id: this.generateUserId(),
        email: 'student@example.com',
        password: this.hashPassword('Student@123'), // Simple hash for demo
        profile: {
          name: 'Rahul Kumar',
          age: 22,
          gender: 'male',
          height: 175, // cm
          weight: 68, // kg
          bloodType: 'O+',
          dateOfBirth: '2003-05-15',
          phone: '+91-9876543210',
          address: 'New Delhi, India',
          emergencyContact: '+91-9123456789'
        },
        healthData: {
          allergies: ['Peanuts', 'Dust'],
          chronicConditions: [],
          medications: [],
          lastCheckup: '2024-10-15',
          bloodPressure: { systolic: 118, diastolic: 76 },
          cholesterol: { total: 180, hdl: 55, ldl: 110 },
          bloodGlucose: 92,
          bmi: 22.2,
          smoker: false,
          diabetic: false,
          familyHistory: {
            diabetes: false,
            heartDisease: false,
            cancer: false
          }
        },
        preferences: {
          theme: 'light',
          notifications: true,
          language: 'en',
          units: 'metric'
        },
        goals: {
          steps: 10000,
          water: 8,
          sleep: 7,
          calories: 2200,
          exercise: 30
        },
        createdAt: Date.now(),
        lastLogin: null
      };
      
      this.saveUser(sampleStudent);
      console.log('[AuthSystem] Sample student user created');
    }
  }

  /**
   * Generate unique user ID
   */
  generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Simple password hashing (for demo - use bcrypt in production)
   */
  hashPassword(password) {
    // Simple hash for demo purposes (NOT secure for production!)
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  /**
   * Register new user
   */
  register(email, password, profile) {
    // Validate email
    if (!this.validateEmail(email)) {
      return { success: false, error: 'Invalid email format' };
    }
    
    // Validate password strength
    if (!this.validatePassword(password)) {
      return { 
        success: false, 
        error: 'Password must be at least 8 characters with uppercase, lowercase, and number' 
      };
    }
    
    // Check if user already exists
    if (this.getUserByEmail(email)) {
      return { success: false, error: 'User already exists with this email' };
    }
    
    // Create new user
    const user = {
      id: this.generateUserId(),
      email: email.toLowerCase(),
      password: this.hashPassword(password),
      profile: profile || {},
      healthData: {},
      preferences: {
        theme: 'light',
        notifications: true
      },
      goals: {
        steps: 10000,
        water: 8,
        sleep: 7,
        calories: 2000,
        exercise: 30
      },
      createdAt: Date.now(),
      lastLogin: null
    };
    
    this.saveUser(user);
    
    return { success: true, user: this.sanitizeUser(user) };
  }

  /**
   * Login user
   */
  login(email, password) {
    const user = this.getUserByEmail(email.toLowerCase());
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    const hashedPassword = this.hashPassword(password);
    
    if (user.password !== hashedPassword) {
      return { success: false, error: 'Incorrect password' };
    }
    
    // Update last login
    user.lastLogin = Date.now();
    this.saveUser(user);
    
    // Create session
    this.createSession(user);
    
    return { success: true, user: this.sanitizeUser(user) };
  }

  /**
   * Logout current user
   */
  logout() {
    this.currentUser = null;
    localStorage.removeItem(this.sessionKey);
    console.log('[AuthSystem] User logged out');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return this.currentUser !== null;
  }

  /**
   * Get current logged-in user
   */
  getCurrentUser() {
    return this.currentUser ? this.sanitizeUser(this.currentUser) : null;
  }

  /**
   * Create session
   */
  createSession(user) {
    this.currentUser = user;
    const session = {
      userId: user.id,
      email: user.email,
      createdAt: Date.now(),
      expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
    };
    localStorage.setItem(this.sessionKey, JSON.stringify(session));
  }

  /**
   * Load existing session
   */
  loadSession() {
    const sessionData = localStorage.getItem(this.sessionKey);
    
    if (!sessionData) return false;
    
    try {
      const session = JSON.parse(sessionData);
      
      // Check if session expired
      if (session.expiresAt < Date.now()) {
        this.logout();
        return false;
      }
      
      // Load user from database
      const user = this.getUserById(session.userId);
      
      if (user) {
        this.currentUser = user;
        console.log('[AuthSystem] Session restored for:', user.email);
        return true;
      }
      
    } catch (error) {
      console.error('[AuthSystem] Session load error:', error);
    }
    
    return false;
  }

  /**
   * Save user to database
   */
  saveUser(user) {
    const users = this.getAllUsers();
    const index = users.findIndex(u => u.id === user.id);
    
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }

  /**
   * Get all users from database
   */
  getAllUsers() {
    const data = localStorage.getItem(this.usersKey);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Get user by ID
   */
  getUserById(id) {
    const users = this.getAllUsers();
    return users.find(u => u.id === id);
  }

  /**
   * Get user by email
   */
  getUserByEmail(email) {
    const users = this.getAllUsers();
    return users.find(u => u.email === email.toLowerCase());
  }

  /**
   * Update user profile
   */
  updateProfile(userId, updates) {
    const user = this.getUserById(userId);
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    // Merge updates
    user.profile = { ...user.profile, ...updates.profile };
    user.healthData = { ...user.healthData, ...updates.healthData };
    user.preferences = { ...user.preferences, ...updates.preferences };
    user.goals = { ...user.goals, ...updates.goals };
    
    this.saveUser(user);
    
    // Update current user if it's the same
    if (this.currentUser && this.currentUser.id === userId) {
      this.currentUser = user;
    }
    
    return { success: true, user: this.sanitizeUser(user) };
  }

  /**
   * Change password
   */
  changePassword(userId, oldPassword, newPassword) {
    const user = this.getUserById(userId);
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    // Verify old password
    if (user.password !== this.hashPassword(oldPassword)) {
      return { success: false, error: 'Current password is incorrect' };
    }
    
    // Validate new password
    if (!this.validatePassword(newPassword)) {
      return { 
        success: false, 
        error: 'New password must be at least 8 characters with uppercase, lowercase, and number' 
      };
    }
    
    user.password = this.hashPassword(newPassword);
    this.saveUser(user);
    
    return { success: true, message: 'Password changed successfully' };
  }

  /**
   * Validate email format
   */
  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  /**
   * Validate password strength
   */
  validatePassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    return password.length >= 8 &&
           /[a-z]/.test(password) &&
           /[A-Z]/.test(password) &&
           /[0-9]/.test(password);
  }

  /**
   * Remove sensitive data from user object
   */
  sanitizeUser(user) {
    const { password, ...sanitized } = user;
    return sanitized;
  }

  /**
   * Delete user account
   */
  deleteAccount(userId, password) {
    const user = this.getUserById(userId);
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    // Verify password
    if (user.password !== this.hashPassword(password)) {
      return { success: false, error: 'Incorrect password' };
    }
    
    // Remove from database
    const users = this.getAllUsers();
    const filtered = users.filter(u => u.id !== userId);
    localStorage.setItem(this.usersKey, JSON.stringify(filtered));
    
    // Logout if current user
    if (this.currentUser && this.currentUser.id === userId) {
      this.logout();
    }
    
    return { success: true, message: 'Account deleted successfully' };
  }

  /**
   * Reset password (simplified - would need email in production)
   */
  resetPassword(email) {
    const user = this.getUserByEmail(email.toLowerCase());
    
    if (!user) {
      // Don't reveal if user exists
      return { success: true, message: 'If email exists, reset link has been sent' };
    }
    
    // In production, send email with reset link
    console.log('[AuthSystem] Password reset requested for:', email);
    
    return { success: true, message: 'If email exists, reset link has been sent' };
  }
}

// Global instance
window.AuthSystem = new AuthSystem();
