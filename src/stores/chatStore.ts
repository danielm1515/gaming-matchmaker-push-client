import { create } from 'zustand';
import type { Message } from '../types/domain';

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

interface ChatState {
  messages: Message[];
  connectionStatus: ConnectionStatus;
  partyId: string | null;

  addMessage: (msg: Message) => void;
  setMessages: (msgs: Message[]) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  setPartyId: (id: string | null) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  connectionStatus: 'disconnected',
  partyId: null,

  addMessage: (msg) =>
    set((state) => ({ messages: [...state.messages, msg] })),

  setMessages: (msgs) => set({ messages: msgs }),

  setConnectionStatus: (status) => set({ connectionStatus: status }),

  setPartyId: (id) => set({ partyId: id }),

  clearChat: () => set({ messages: [], connectionStatus: 'disconnected', partyId: null }),
}));
