
export interface User {
  regNo: string;
  name: string;
  isPasswordReset: boolean;
}


export interface LoginCredentials {
  regNo: string;
  password: string;
}


export interface AuthResponse {
  token: string;
  regNo: string;
  name: string;
  isPasswordReset: boolean;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  message: string;
  requiresHumanIntervention?: boolean;
}