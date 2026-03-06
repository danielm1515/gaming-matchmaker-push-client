import { Wifi, WifiOff, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useChatStore } from '../../stores/chatStore';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

interface ChatPanelProps {
  currentPlayerId: string;
  onSend: (content: string) => void;
}

const STATUS_ICON = {
  connected: <Wifi size={12} className="text-accent-success" />,
  connecting: <Loader2 size={12} className="text-accent-warning animate-spin" />,
  disconnected: <WifiOff size={12} className="text-accent-danger" />,
};

export default function ChatPanel({ currentPlayerId, onSend }: ChatPanelProps) {
  const { t } = useTranslation();
  const { messages, connectionStatus } = useChatStore();

  const STATUS_LABEL = {
    connected: t('chat.connected'),
    connecting: t('chat.connecting'),
    disconnected: t('chat.disconnected'),
  };

  return (
    <div className="flex flex-col h-full bg-bg-secondary border-l border-bg-border">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-bg-border">
        <span className="font-display font-semibold text-text-primary">{t('chat.partyChat')}</span>
        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
          {STATUS_ICON[connectionStatus]}
          {STATUS_LABEL[connectionStatus]}
        </div>
      </div>

      {/* Messages */}
      <MessageList messages={messages} currentPlayerId={currentPlayerId} />

      {/* Input */}
      <ChatInput
        onSend={onSend}
        disabled={connectionStatus !== 'connected'}
      />
    </div>
  );
}
