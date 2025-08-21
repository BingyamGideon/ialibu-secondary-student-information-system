// Authentication and User Management System - Updated for MySQL Database
import { apiService } from './apiService';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: 'admin' | 'staff';
  department?: string;
  position?: string;
  isActive: boolean;
  createdAt?: string;
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
  currentUser: User | null;
  currentSession: Session | null;
  isAuthenticated: boolean;
  token: string | null;
}

type AuthChangeListener = () => void;

class AuthStore {
  private state: AuthState;
  private listeners: AuthChangeListener[] = [];
  private storageKey = 'school_auth_state';

  constructor() {
    this.state = this.loadFromStorage();
  }

  private loadFromStorage(): AuthState {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Validate stored session is not expired
        if (parsed.currentSession && new Date(parsed.currentSession.expiresAt) > new Date()) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Error loading auth state from storage:', error);
    }

    return {
      currentUser: null,
      currentSession: null,
      isAuthenticated: false,
      token: null
    };
  }

  private saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (error) {
      console.error('Error saving auth state to storage:', error);
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  subscribe(listener: AuthChangeListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  async login(credentials: LoginCredentials): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const response = await apiService.login(credentials);
      
      if (response.success && response.user) {
        // Create session
        const session: Session = {
          id: response.token || `session_${Date.now()}`,
          userId: response.user.id,
          username: response.user.username,
          userType: response.user.user_type,
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
          isActive: true
        };

        // Update state
        this.state = {
          currentUser: {
            id: response.user.id,
            username: response.user.username,
            email: response.user.email,
            firstName: response.user.first_name,
            lastName: response.user.last_name,
            userType: response.user.user_type,
            department: response.user.department,
            position: response.user.position,
            isActive: response.user.is_active,
            permissions: response.user.permissions || []
          },
          currentSession: session,
          isAuthenticated: true,
          token: response.token || null
        };

        this.saveToStorage();
        this.notifyListeners();

        return {
          success: true,
          message: 'Login successful',
          user: this.state.currentUser
        };
      } else {
        return {
          success: false,
          message: response.message || 'Login failed'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'An error occurred during login. Please check your connection and try again.'
      };
    }
  }

  async register(userData: RegisterData): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      // Validate passwords match
      if (userData.password !== userData.confirmPassword) {
        return {
          success: false,
          message: 'Passwords do not match'
        };
      }

      // Validate password strength
      if (userData.password.length < 6) {
        return {
          success: false,
          message: 'Password must be at least 6 characters long'
        };
      }

      const response = await apiService.register({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        userType: userData.userType
      });

      if (response.success) {
        return {
          success: true,
          message: 'Registration successful. You can now log in.'
        };
      } else {
        return {
          success: false,
          message: response.message || 'Registration failed'
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'An error occurred during registration. Please try again.'
      };
    }
  }

  logout(): void {
    this.state = {
      currentUser: null,
      currentSession: null,
      isAuthenticated: false,
      token: null
    };
    
    this.saveToStorage();
    this.notifyListeners();
  }

  getCurrentUser(): User | null {
    return this.state.currentUser;
  }

  isAuthenticated(): boolean {
    if (!this.state.isAuthenticated || !this.state.currentSession) {
      return false;
    }

    // Check if session is expired
    const now = new Date();
    const expiresAt = new Date(this.state.currentSession.expiresAt);
    
    if (now >= expiresAt) {
      this.logout();
      return false;
    }

    return true;
  }

  hasPermission(permission: string): boolean {
    if (!this.state.currentUser) return false;
    
    const permissions = this.state.currentUser.permissions;
    return permissions.includes('all') || permissions.includes(permission);
  }

  updateProfile(userId: number, updates: Partial<User>): boolean {
    if (!this.state.currentUser || this.state.currentUser.id !== userId) {
      return false;
    }

    this.state.currentUser = {
      ...this.state.currentUser,
      ...updates
    };

    this.saveToStorage();
    this.notifyListeners();
    return true;
  }

  changePassword(userId: number, oldPassword: string, newPassword: string): boolean {
    // This would need to be implemented with an API call
    // For now, just return true as placeholder
    console.log('Password change would be handled by API');
    return true;
  }

  // Test database connection
  async testDatabaseConnection() {
    try {
      const response = await apiService.testConnection();
      return response;
    } catch (error) {
      return {
        success: false,
        message: 'Failed to connect to database',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get database statistics
  async getDatabaseStats() {
    try {
      const response = await apiService.getDatabaseStats();
      return response;
    } catch (error) {
      return {
        success: false,
        message: 'Failed to get database statistics',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const authStore = new AuthStore();
