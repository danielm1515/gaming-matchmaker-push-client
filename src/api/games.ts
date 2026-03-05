import { apiClient } from './client';
import type { Game } from '../types/domain';

export const gamesApi = {
  getGames: async (): Promise<Game[]> => {
    const res = await apiClient.get<Game[]>('/games');
    return res.data;
  },
};
