import { apiClient } from './client';
import type { Party, CreatePartyRequest, PartyListParams, Message, DiscordChannel } from '../types/domain';

export const partiesApi = {
  listParties: async (params: PartyListParams = {}): Promise<Party[]> => {
    const res = await apiClient.get<Party[]>('/parties', { params });
    return res.data;
  },
  createParty: async (data: CreatePartyRequest): Promise<Party> => {
    const res = await apiClient.post<Party>('/parties', data);
    return res.data;
  },
  getParty: async (id: string): Promise<Party> => {
    const res = await apiClient.get<Party>(`/parties/${id}`);
    return res.data;
  },
  joinParty: async (id: string): Promise<Party> => {
    const res = await apiClient.post<Party>(`/parties/${id}/join`);
    return res.data;
  },
  leaveParty: async (id: string): Promise<Party> => {
    const res = await apiClient.post<Party>(`/parties/${id}/leave`);
    return res.data;
  },
  disbandParty: async (id: string): Promise<void> => {
    await apiClient.delete(`/parties/${id}`);
  },
  toggleReady: async (id: string): Promise<Party> => {
    const res = await apiClient.post<Party>(`/parties/${id}/ready`);
    return res.data;
  },
  getMessages: async (id: string, limit = 50, offset = 0): Promise<Message[]> => {
    const res = await apiClient.get<Message[]>(`/parties/${id}/messages`, {
      params: { limit, offset },
    });
    return res.data;
  },
  kickMember: async (partyId: string, playerId: string): Promise<Party> => {
    const res = await apiClient.post<Party>(`/parties/${partyId}/kick/${playerId}`);
    return res.data;
  },
  getDiscordChannel: async (id: string): Promise<DiscordChannel | null> => {
    try {
      const res = await apiClient.get<DiscordChannel>(`/parties/${id}/discord`);
      return res.data;
    } catch {
      return null;
    }
  },
  createDiscordChannel: async (id: string): Promise<DiscordChannel> => {
    const res = await apiClient.post<DiscordChannel>(`/parties/${id}/discord`);
    return res.data;
  },
};
