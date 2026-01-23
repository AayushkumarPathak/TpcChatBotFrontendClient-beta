import axios, { type AxiosInstance } from 'axios';
import type { LoginCredentials, AuthResponse, ChatRequest, ChatResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

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
        const token = localStorage.getItem('token');
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

  // Chat APIs
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const response = await this.api.post<ChatResponse>('/chat/', request);
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;