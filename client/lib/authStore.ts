// Authentication and User Management System
import { dataStore } from './dataStore';

export interface User {
  id: number;
  username: string;
  password: string; // In production, this would be hashed
  email: string;
  firstName: string;
  lastName: string;
  userType: 'admin' | 'staff';
  department?: string;
  position?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  permissions: string[];
}

export interface Session {
  id: string;
  userId: number;
  username: string;
  userType: 'admin' | 'staff';
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: 'admin' | 'staff';
  department?: string;
  position?: string;
}

interface AuthState {
  users: User[];
  sessions: Session[];
  currentSession: Session | null;
  lastUpdated: string;
  version: number;
}

type AuthChangeListener = (state: AuthState) => void;

class AuthStore {
  private data: AuthState;
  private listeners: AuthChangeListener[] = [];
  private storageKey = 'school_auth_data';

  constructor() {
    this.data = this.loadFromStorage();
    
    // Listen for storage changes from other tabs/windows
    window.addEventListener('storage', (e) => {
      if (e.key === this.storageKey) {
        const newData = this.loadFromStorage();
        if (newData.version > this.data.version) {
          this.data = newData;
          this.notifyListeners();
        }
      }
    });

    // Clean up expired sessions on initialization
    this.cleanupExpiredSessions();
  }

  private loadFromStorage(): AuthState {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading auth data from storage:', error);
    }

    // Default auth data
    return {
      users: [
        {
          id: 1,
          username: 'admin',
          password: 'admin123', // In production, use bcrypt
          email: 'admin@ialibu.edu.pg',
          firstName: 'System',
          lastName: 'Administrator',
          userType: 'admin',
          department: 'Administration',
          position: 'System Administrator',
          isActive: true,
          createdAt: new Date().toISOString(),
          permissions: ['all']
        },
        {
          id: 2,
          username: 'staff',
          password: 'staff123',
          email: 'staff@ialibu.edu.pg',
          firstName: 'Teacher',
          lastName: 'Demo',
          userType: 'staff',
          department: 'Academic',
          position: 'Teacher',
          isActive: true,
          createdAt: new Date().toISOString(),
          permissions: ['students', 'attendance', 'grades', 'reports']
        }
      ],
      sessions: [],
      currentSession: null,
      lastUpdated: new Date().toISOString(),
      version: 1
    };
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (error) {
      console.error('Error saving auth data to storage:', error);
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.data));
  }

  private updateVersion(): void {
    this.data.version += 1;
    this.data.lastUpdated = new Date().toISOString();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private cleanupExpiredSessions(): void {
    const now = new Date();
    this.data.sessions = this.data.sessions.filter(session => {
      const expiresAt = new Date(session.expiresAt);
      return expiresAt > now && session.isActive;
    });
    this.saveToStorage();
  }

  // Subscribe to auth changes
  subscribe(listener: AuthChangeListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Get current auth state
  getState(): AuthState {
    return { ...this.data };
  }

  // Get current user
  getCurrentUser(): User | null {
    if (!this.data.currentSession) return null;
    return this.data.users.find(u => u.id === this.data.currentSession!.userId) || null;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    if (!this.data.currentSession) return false;
    
    const session = this.data.currentSession;
    const now = new Date();
    const expiresAt = new Date(session.expiresAt);
    
    return session.isActive && expiresAt > now;
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<{ success: boolean; message: string; user?: User }> {
    const { username, password } = credentials;
    
    // Find user
    const user = this.data.users.find(u => 
      u.username === username && 
      u.password === password && 
      u.isActive
    );

    if (!user) {
      return { success: false, message: 'Invalid username or password' };
    }

    // Create session
    const sessionId = this.generateSessionId();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    const session: Session = {
      id: sessionId,
      userId: user.id,
      username: user.username,
      userType: user.userType,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      isActive: true
    };

    // Update user last login
    user.lastLogin = now.toISOString();

    // Add session and set as current
    this.data.sessions.push(session);
    this.data.currentSession = session;

    this.updateVersion();
    this.saveToStorage();
    this.notifyListeners();

    return { success: true, message: 'Login successful', user };
  }

  // Register new user
  async register(userData: RegisterData): Promise<{ success: boolean; message: string; user?: User }> {
    const {
      username,
      password,
      confirmPassword,
      email,
      firstName,
      lastName,
      userType,
      department,
      position
    } = userData;

    // Validation
    if (password !== confirmPassword) {
      return { success: false, message: 'Passwords do not match' };
    }

    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long' };
    }

    // Check if username exists
    const existingUser = this.data.users.find(u => u.username === username);
    if (existingUser) {
      return { success: false, message: 'Username already exists' };
    }

    // Check if email exists
    const existingEmail = this.data.users.find(u => u.email === email);
    if (existingEmail) {
      return { success: false, message: 'Email already registered' };
    }

    // Create new user
    const newUser: User = {
      id: Math.max(...this.data.users.map(u => u.id), 0) + 1,
      username,
      password, // In production, hash this with bcrypt
      email,
      firstName,
      lastName,
      userType,
      department,
      position,
      isActive: true,
      createdAt: new Date().toISOString(),
      permissions: userType === 'admin' 
        ? ['all'] 
        : ['students', 'attendance', 'grades', 'reports']
    };

    this.data.users.push(newUser);
    this.updateVersion();
    this.saveToStorage();
    this.notifyListeners();

    return { success: true, message: 'Registration successful', user: newUser };
  }

  // Logout user
  logout(): void {
    if (this.data.currentSession) {
      // Deactivate current session
      const sessionIndex = this.data.sessions.findIndex(s => s.id === this.data.currentSession!.id);
      if (sessionIndex !== -1) {
        this.data.sessions[sessionIndex].isActive = false;
      }
      
      this.data.currentSession = null;
      this.updateVersion();
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  // Update user profile
  updateProfile(userId: number, updates: Partial<User>): boolean {
    const userIndex = this.data.users.findIndex(u => u.id === userId);
    if (userIndex === -1) return false;

    // Don't allow updating certain fields
    const { id, createdAt, ...allowedUpdates } = updates;
    
    this.data.users[userIndex] = {
      ...this.data.users[userIndex],
      ...allowedUpdates
    };

    this.updateVersion();
    this.saveToStorage();
    this.notifyListeners();
    return true;
  }

  // Change password
  changePassword(userId: number, oldPassword: string, newPassword: string): boolean {
    const user = this.data.users.find(u => u.id === userId);
    if (!user || user.password !== oldPassword) return false;

    if (newPassword.length < 6) return false;

    user.password = newPassword; // In production, hash this
    this.updateVersion();
    this.saveToStorage();
    this.notifyListeners();
    return true;
  }

  // Admin functions
  getAllUsers(): User[] {
    return this.data.users.map(user => ({
      ...user,
      password: '***' // Don't expose passwords
    }));
  }

  createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...userData,
      id: Math.max(...this.data.users.map(u => u.id), 0) + 1,
      createdAt: new Date().toISOString()
    };

    this.data.users.push(newUser);
    this.updateVersion();
    this.saveToStorage();
    this.notifyListeners();
    return newUser;
  }

  updateUser(userId: number, updates: Partial<User>): boolean {
    return this.updateProfile(userId, updates);
  }

  deleteUser(userId: number): boolean {
    const userIndex = this.data.users.findIndex(u => u.id === userId);
    if (userIndex === -1) return false;

    // Don't allow deleting the current user
    if (this.data.currentSession && this.data.currentSession.userId === userId) {
      return false;
    }

    this.data.users.splice(userIndex, 1);
    
    // Deactivate all sessions for this user
    this.data.sessions = this.data.sessions.map(session => 
      session.userId === userId 
        ? { ...session, isActive: false }
        : session
    );

    this.updateVersion();
    this.saveToStorage();
    this.notifyListeners();
    return true;
  }

  // Session management
  getAllSessions(): Session[] {
    return this.data.sessions.filter(s => s.isActive);
  }

  revokeSession(sessionId: string): boolean {
    const sessionIndex = this.data.sessions.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1) return false;

    this.data.sessions[sessionIndex].isActive = false;
    
    // If this is the current session, clear it
    if (this.data.currentSession && this.data.currentSession.id === sessionId) {
      this.data.currentSession = null;
    }

    this.updateVersion();
    this.saveToStorage();
    this.notifyListeners();
    return true;
  }

  // Initialize session from storage (for page refresh)
  initializeSession(): void {
    if (this.data.currentSession) {
      const session = this.data.sessions.find(s => 
        s.id === this.data.currentSession!.id && 
        s.isActive &&
        new Date(s.expiresAt) > new Date()
      );

      if (!session) {
        this.data.currentSession = null;
        this.saveToStorage();
      }
    }
  }

  // Check user permissions
  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    return user.permissions.includes('all') || user.permissions.includes(permission);
  }
}

// Create singleton instance
export const authStore = new AuthStore();

// Initialize session on app start
authStore.initializeSession();
