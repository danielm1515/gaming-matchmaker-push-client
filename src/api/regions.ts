import { apiClient } from './client';
import type { Region } from '../types/domain';

export const regionsApi = {
  getRegions: async (): Promise<Region[]> => {
    const res = await apiClient.get<Region[]>('/regions');
    return res.data;
  },
};
