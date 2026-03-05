import { format } from 'date-fns';
import type { Message } from '../../types/domain';
import PlayerAvatar from '../player/PlayerAvatar';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export default function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const isSystem = message.type === 'JOIN' || message.type === 'LEAVE' || message.type === 'SYSTEM';

  if (isSystem) {
    return (
      <div className="flex justify-center my-1">
        <span className="text-xs text-text-muted italic px-3 py-1 bg-bg-elevated rounded-full">
          {message.content}
        </span>
      </div>
    );
  }

  const time = format(new Date(message.sent_at), 'HH:mm');

  if (isOwn) {
    return (
      <div className="flex justify-end gap-2 items-end">
        <span className="text-xs text-text-muted mb-1">{time}</span>
        <div className="max-w-[70%] px-3 py-2 rounded-2xl rounded-br-sm bg-accent-primary text-white text-sm">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 items-end">
      {message.sender && (
        <PlayerAvatar player={message.sender} size={26} className="shrink-0 mb-1" />
      )}
      <div className="max-w-[70%]">
        {message.sender && (
          <span className="text-xs text-text-muted mb-0.5 block">{message.sender.username}</span>
        )}
        <div className="px-3 py-2 rounded-2xl rounded-bl-sm bg-bg-elevated border border-bg-border text-sm text-text-primary">
          {message.content}
        </div>
      </div>
      <span className="text-xs text-text-muted mb-1">{time}</span>
    </div>
  );
}
