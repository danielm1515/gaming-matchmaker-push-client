import { useEffect, useRef, useCallback } from 'react';
import { useChatStore } from '../stores/chatStore';
import type { Message } from '../types/domain';

const WS_BASE = 'wss://gaming-matchmaker-push.onrender.com/api';

export function useWebSocket(partyId: string | null, token: string | null) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRef = useRef(true);
  const { addMessage, setConnectionStatus } = useChatStore();

  const connect = useCallback(() => {
    if (!partyId || !token || !activeRef.current) return;

    setConnectionStatus('connecting');
    const ws = new WebSocket(`${WS_BASE}/ws/party/${partyId}?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => setConnectionStatus('connected');

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as Message;
        addMessage(data);
      } catch {
        // ignore malformed
      }
    };

    ws.onerror = () => setConnectionStatus('disconnected');

    ws.onclose = () => {
      setConnectionStatus('disconnected');
      if (activeRef.current) {
        reconnectRef.current = setTimeout(connect, 3000);
      }
    };
  }, [partyId, token, addMessage, setConnectionStatus]);

  useEffect(() => {
    activeRef.current = true;
    connect();

    return () => {
      activeRef.current = false;
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      wsRef.current?.close();
    };
  }, [connect]);

  const sendMessage = useCallback((content: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'TEXT', content }));
    }
  }, []);

  return { sendMessage };
}
