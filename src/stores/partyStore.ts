import { create } from 'zustand';
import type { Party, PartyMember } from '../types/domain';

interface PartyState {
  currentParty: Party | null;
  setParty: (party: Party) => void;
  clearParty: () => void;
  updateMember: (playerId: string, updates: Partial<PartyMember>) => void;
  removeMember: (playerId: string) => void;
}

export const usePartyStore = create<PartyState>((set, get) => ({
  currentParty: null,

  setParty: (party) => set({ currentParty: party }),

  clearParty: () => set({ currentParty: null }),

  updateMember: (playerId, updates) => {
    const party = get().currentParty;
    if (!party) return;
    set({
      currentParty: {
        ...party,
        members: party.members.map((m) =>
          m.player.id === playerId ? { ...m, ...updates } : m
        ),
      },
    });
  },

  removeMember: (playerId) => {
    const party = get().currentParty;
    if (!party) return;
    set({
      currentParty: {
        ...party,
        members: party.members.filter((m) => m.player.id !== playerId),
      },
    });
  },
}));
