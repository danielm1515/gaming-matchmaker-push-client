import { apiClient } from './client';
import type { Player, PlayerUpdateRequest, AddGameRequest, PlayerListParams } from '../types/domain';

export const playersApi = {
  getMe: async (): Promise<Player> => {
    const res = await apiClient.get<Player>('/players/me');
    return res.data;
  },
  updateMe: async (data: PlayerUpdateRequest): Promise<Player> => {
    const res = await apiClient.put<Player>('/players/me', data);
    return res.data;
  },
  listPlayers: async (params: PlayerListParams = {}): Promise<Player[]> => {
    const res = await apiClient.get<Player[]>('/players', { params });
    return res.data;
  },
  getPlayer: async (id: string): Promise<Player> => {
    const res = await apiClient.get<Player>(`/players/${id}`);
    return res.data;
  },
  addGame: async (data: AddGameRequest): Promise<Player> => {
    const res = await apiClient.post<Player>('/players/me/games', data);
    return res.data;
  },
  removeGame: async (gameId: string): Promise<Player> => {
    const res = await apiClient.delete<Player>(`/players/me/games/${gameId}`);
    return res.data;
  },
};
