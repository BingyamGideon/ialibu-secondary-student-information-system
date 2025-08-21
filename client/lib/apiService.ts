// API Service for connecting to XAMPP MySQL backend
// Falls back to localStorage if API is not available
const API_BASE_URL = 'http://localhost/school-management/server';

// Check if we're in a development environment where XAMPP might not be available
const isCloudEnvironment = () => {
  return window.location.hostname.includes('fly.dev') ||
         window.location.hostname.includes('vercel.app') ||
         window.location.hostname.includes('netlify.app') ||
         window.location.hostname !== 'localhost';
};

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  user?: any;
  token?: string;
  error?: string;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // If we're in a cloud environment, immediately return API unavailable
    if (isCloudEnvironment()) {
      return {
        success: false,
        message: 'API server not available in cloud environment. Using local storage instead.',
        error: 'API_UNAVAILABLE'
      };
    }

    try {
      const url = `${this.baseUrl}/${endpoint}`;

      const defaultOptions: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      };

      const response = await fetch(url, {
        ...defaultOptions,
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Request failed:', error);

      // Check if it's a network error (XAMPP not running)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          success: false,
          message: 'Cannot connect to XAMPP server. Using local storage instead.',
          error: 'API_UNAVAILABLE'
        };
      }

      return {
        success: false,
        message: 'An error occurred while connecting to the server',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Authentication API calls
  async login(credentials: { username: string; password: string }) {
    return this.request('auth.php?action=login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    userType: 'admin' | 'staff';
  }) {
    return this.request('auth.php?action=register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getUserProfile(userId: string) {
    return this.request(`auth.php?action=profile&user_id=${userId}`);
  }

  // Database API calls
  async testConnection() {
    return this.request('database.php?action=test');
  }

  async getDatabaseStats() {
    return this.request('database.php?action=stats');
  }

  // Students API calls
  async getStudents() {
    return this.request('students.php?action=list');
  }

  async addStudent(studentData: any) {
    return this.request('students.php?action=add', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  }

  async updateStudent(studentId: number, studentData: any) {
    return this.request(`students.php?action=update&id=${studentId}`, {
      method: 'PUT',
      body: JSON.stringify(studentData),
    });
  }

  async deleteStudent(studentId: number) {
    return this.request(`students.php?action=delete&id=${studentId}`, {
      method: 'DELETE',
    });
  }

  // Attendance API calls
  async getAttendance(filters?: any) {
    const params = filters ? `&${new URLSearchParams(filters).toString()}` : '';
    return this.request(`attendance.php?action=list${params}`);
  }

  async recordAttendance(attendanceData: any) {
    return this.request('attendance.php?action=record', {
      method: 'POST',
      body: JSON.stringify(attendanceData),
    });
  }

  // Grades API calls
  async getGrades(filters?: any) {
    const params = filters ? `&${new URLSearchParams(filters).toString()}` : '';
    return this.request(`grades.php?action=list${params}`);
  }

  async addGrade(gradeData: any) {
    return this.request('grades.php?action=add', {
      method: 'POST',
      body: JSON.stringify(gradeData),
    });
  }

  // Finance API calls
  async getFinanceRecords(filters?: any) {
    const params = filters ? `&${new URLSearchParams(filters).toString()}` : '';
    return this.request(`finance.php?action=list${params}`);
  }

  async addFinanceRecord(financeData: any) {
    return this.request('finance.php?action=add', {
      method: 'POST',
      body: JSON.stringify(financeData),
    });
  }

  async updatePaymentStatus(paymentId: number, status: string) {
    return this.request(`finance.php?action=update_status&id=${paymentId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Staff API calls
  async getStaff() {
    return this.request('staff.php?action=list');
  }

  async addStaff(staffData: any) {
    return this.request('staff.php?action=add', {
      method: 'POST',
      body: JSON.stringify(staffData),
    });
  }

  // Users API calls
  async getAllUsers() {
    return this.request('users.php?action=list');
  }

  async addUser(userData: any) {
    return this.request('users.php?action=add', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(userId: number, userData: any) {
    return this.request(`users.php?action=update&id=${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(userId: number) {
    return this.request(`users.php?action=delete&id=${userId}`, {
      method: 'DELETE',
    });
  }

  async changeUserPassword(userId: number, newPassword: string) {
    return this.request(`users.php?action=change_password&id=${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ password: newPassword }),
    });
  }
}

export const apiService = new ApiService();
export default apiService;
