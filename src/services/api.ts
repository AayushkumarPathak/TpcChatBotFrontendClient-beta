



import axios, { type AxiosInstance } from 'axios';
import type { LoginCredentials, AuthResponse, ChatRequest, ChatResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_BACKEND_API_BASE_URL is not defined");
}

class ApiService {
  private api: AxiosInstance;


  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add token
    this.api.interceptors.request.use(
      (config) => {
        // Use adminToken for admin endpoints, token for others
        const isAdminRoute = config.url?.startsWith('/admin') || config.url?.includes('/register-bulk');
        const token = isAdminRoute
          ? localStorage.getItem('adminToken')
          : localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth APIs
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  }

  async logout(): Promise<void> {
    await this.api.post('/auth/logout');
  }

  async validateToken(): Promise<{ valid: boolean; user?: any }> {
    const response = await this.api.get('/auth/validate');
    return response.data;
  }

  // Admin Auth APIs
  async registerAdmin(credentials: { email: string; password: string }): Promise<{ message: string; admin: { email: string; id: string } }> {
    const token = localStorage.getItem('adminToken');
    const response = await this.api.post('/auth/admin/register', credentials, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }

  async loginAdmin(credentials: { email: string; password: string }): Promise<{ token: string; email: string }> {
    const response = await this.api.post('/auth/admin/login', credentials);
    return response.data;
  }

  async registerBulkStudents(students: Array<{ regNo: string; name: string; dob: string }>): Promise<Array<{ regNo: string; name: string }>> {
    const token = localStorage.getItem('adminToken');
    const response = await this.api.post('/auth/register-bulk', students, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }

  // Chat APIs
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const response = await this.api.post<ChatResponse>('/chat/', request);
    return response.data;
  }

  async fetchAllAdmins(): Promise<any[]> {
    const token = localStorage.getItem('adminToken');
    const response = await this.api.get('/admin/all-admins', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.admins;
  }

  async fetchAllUsers(): Promise<any[]> {
    const token = localStorage.getItem('adminToken');
    const response = await this.api.get('/admin/all-users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.users;
  }
    async deleteStudent(regNo: string): Promise<any> {
    const token = localStorage.getItem('adminToken');
    const response = await this.api.delete(`/student/delete/${regNo}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }
    async updateStudent(regNo: string, data: { name: string; dob: string }): Promise<any> {
    const token = localStorage.getItem('adminToken');
    const response = await this.api.put(`/student/update/${regNo}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;