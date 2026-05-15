import { request } from "../utils/api";

export interface User {
  id: string;
  email: string;
  fullName: string;
  plan: "FREE" | "PRO" | "PRO_MAX" | "ENTERPRISE";
  verifiedAt?: string;
  organisation?: string;
  stats?: {
    total: number | string;
    authentic: number | string;
    suspicious: number | string;
    highRisk: number | string;
  };
  history?: any[];
}

export interface AuthResponse {
  user: User;
  token: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  organisation?: string;
}

export const authApi = {
  login: (credentials: LoginCredentials) =>
    request<AuthResponse>({
      method: "POST",
      path: "/login",
      body: credentials,
    }),

  register: (data: RegisterData) => {
    // Split fullName into firstName and lastName for backend compatibility
    const nameParts = data.fullName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    return request<AuthResponse>({
      method: "POST",
      path: "/register",
      body: {
        email: data.email,
        password: data.password,
        firstName,
        lastName,
        organisation: data.organisation,
      },
    });
  },

  getMe: () =>
    request<User>({
      method: "GET",
      path: "/profile",
    }),

  updatePlan: (plan: string) =>
    request<User>({
      method: "PUT",
      path: "/users/update-plan",
      body: { plan },
    }),
};
