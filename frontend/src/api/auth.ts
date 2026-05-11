import { request } from '../utils/api';

export interface User {
  id: string;
  email: string;
  fullName: string;
  plan: 'PRO' | 'PRO_MAX' | 'ENTERPRISE';
  verifiedAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = {
  login: (credentials: any) => 
    request<AuthResponse>({
      method: 'POST',
      path: '/auth/login',
      body: credentials,
    }),

  register: (data: any) => 
    request<AuthResponse>({
      method: 'POST',
      path: '/auth/register',
      body: data,
    }),

  getMe: () => 
    request<User>({
      method: 'GET',
      path: '/auth/me',
    }),

  updatePlan: (plan: string) => 
    request<User>({
      method: 'PUT',
      path: '/auth/update-plan',
      body: { plan },
    }),
};
