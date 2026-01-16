/**
 * Authentication API endpoints
 */

import api from "./index";

export const authAPI = {
  login: (emailOrUsername: string, password: string) => {
    // Backend accepts username or email - try username first
    const loginPayload = emailOrUsername.includes('@') 
      ? { email: emailOrUsername, password }
      : { email: emailOrUsername, password }; // Backend might expect email field
    
    return api.post("/auth/login", loginPayload);
  },

  register: (userData: any) => 
    api.post("/auth/register", userData),

  logout: () => 
    api.post("/auth/logout"),

  // Canonical name
  me: () => 
    api.get("/auth/me"),

  // Backward-compatible alias
  getMe: () => 
    api.get("/auth/me"),

  forgotPassword: (email: string) => 
    api.post("/auth/forgot-password", { email }),

  // Backend expects confirmPassword too
  resetPassword: (token: string, password: string, confirmPassword: string) =>
    api.post("/auth/reset-password", { token, password, confirmPassword }),

  // Backend route is POST /api/auth/refresh-token
  refresh: () => 
    api.post("/auth/refresh-token"),
};

