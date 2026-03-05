import { apiClient } from './client';
import type { RegisterRequest, LoginRequest } from '../types/domain';

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export const authApi = {
  register: async (data: RegisterRequest): Promise<TokenResponse> => {
    const res = await apiClient.post<TokenResponse>('/auth/register', data);
    return res.data;
  },
  login: async (data: LoginRequest): Promise<TokenResponse> => {
    const res = await apiClient.post<TokenResponse>('/auth/login', data);
    return res.data;
  },
};
