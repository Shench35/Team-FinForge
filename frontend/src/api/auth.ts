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
      path: '/login',
      body: credentials,
    }),

  register: (data: any) => {
    // Split fullName into firstName and lastName for backend compatibility
    const nameParts = data.fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    return request<AuthResponse>({
      method: 'POST',
      path: '/register',
      body: {
        email: data.email,
        password: data.password,
        firstName,
        lastName,
        organisation: data.organisation
      },
    });
  },

  getMe: () => 
    request<User>({
      method: 'GET',
      path: '/users/me', // Adjusted based on common patterns, update if different
    }),

  updatePlan: (plan: string) => 
    request<User>({
      method: 'PUT',
      path: '/users/update-plan',
      body: { plan },
    }),
};
