import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { Message } from '../../types/domain';
import MessageBubble from './MessageBubble';

interface MessageListProps {
  messages: Message[];
  currentPlayerId: string;
}

export default function MessageList({ messages, currentPlayerId }: MessageListProps) {
  const { t } = useTranslation();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-text-muted">{t('chat.noMessages')}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2">
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id ?? `${msg.sent_at}-${msg.content}`}
          message={msg}
          isOwn={msg.sender?.id === currentPlayerId}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
