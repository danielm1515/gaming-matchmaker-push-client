import { apiClient } from './client';
import type { MatchResult } from '../types/domain';

export const matchingApi = {
  findMatches: async (gameId: string, maxSkillDistance = 2, limit = 10): Promise<MatchResult[]> => {
    const res = await apiClient.get<MatchResult[]>('/match/find', {
      params: { game_id: gameId, max_skill_distance: maxSkillDistance, limit },
    });
    return res.data;
  },
};
