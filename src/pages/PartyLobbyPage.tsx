import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Crown, LogOut, Trash2, CheckCircle2, Swords, MapPin, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';
import { useChatStore } from '../stores/chatStore';
import { partiesApi } from '../api/parties';
import { useWebSocket } from '../hooks/useWebSocket';
import Navbar from '../components/layout/Navbar';
import PartySlot from '../components/party/PartySlot';
import ChatPanel from '../components/chat/ChatPanel';
import SkillBadge from '../components/player/SkillBadge';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';

export default function PartyLobbyPage() {
  const { partyId } = useParams<{ partyId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { player, token } = useAuthStore();
  const { setMessages, clearChat } = useChatStore();

  const { data: party, isLoading, refetch } = useQuery({
    queryKey: ['party', partyId],
    queryFn: () => partiesApi.getParty(partyId!),
    refetchInterval: 5000,
    enabled: !!partyId,
  });

  // Load chat history
  useEffect(() => {
    if (!partyId) return;
    partiesApi.getMessages(partyId).then(setMessages).catch(() => {});
    return () => clearChat();
  }, [partyId]);

  // WebSocket for real-time chat
  const { sendMessage } = useWebSocket(partyId ?? null, token);

  const isLeader = party?.leader.id === player?.id;
  const isMember = party?.members.some((m) => m.player.id === player?.id);
  const myMembership = party?.members.find((m) => m.player.id === player?.id);

  const leaveMutation = useMutation({
    mutationFn: () => partiesApi.leaveParty(partyId!),
    onSuccess: () => {
      toast.success('Left the party');
      navigate('/parties');
    },
    onError: (err: any) => toast.error(err?.response?.data?.detail ?? 'Failed to leave'),
  });

  const disbandMutation = useMutation({
    mutationFn: () => partiesApi.disbandParty(partyId!),
    onSuccess: () => {
      toast.success('Party disbanded');
      navigate('/parties');
    },
    onError: (err: any) => toast.error(err?.response?.data?.detail ?? 'Failed to disband'),
  });

  const readyMutation = useMutation({
    mutationFn: () => partiesApi.toggleReady(partyId!),
    onSuccess: () => refetch(),
  });

  const kickMutation = useMutation({
    mutationFn: (playerId: string) => partiesApi.kickMember(partyId!, playerId),
    onSuccess: () => { refetch(); toast.success('Player kicked'); },
    onError: (err: any) => toast.error(err?.response?.data?.detail ?? 'Failed to kick'),
  });

  const { data: discordChannel, refetch: refetchDiscord } = useQuery({
    queryKey: ['discord', partyId],
    queryFn: () => partiesApi.getDiscordChannel(partyId!),
    enabled: !!partyId,
  });

  const createDiscordMutation = useMutation({
    mutationFn: () => partiesApi.createDiscordChannel(partyId!),
    onSuccess: () => { refetchDiscord(); toast.success('Discord channel created!'); },
    onError: (err: any) => toast.error(err?.response?.data?.detail ?? 'Failed to create Discord channel'),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <Spinner size={40} />
      </div>
    );
  }

  if (!party) {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center gap-4">
        <p className="text-text-secondary">Party not found.</p>
        <Button variant="primary" onClick={() => navigate('/parties')}>Back to Parties</Button>
      </div>
    );
  }

  const slots = Array.from({ length: party.max_size }).map((_, i) => party.members[i]);

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      <Navbar />

      <div className="flex-1 flex overflow-hidden" style={{ height: 'calc(100vh - 56px)' }}>
        {/* Left: Party info */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Swords size={20} className="text-accent-primary" />
                <h1 className="font-display text-2xl font-bold text-text-primary">
                  {party.name || `${party.game.name} Party`}
                </h1>
              </div>
              <div className="flex items-center gap-3 text-sm text-text-secondary flex-wrap">
                <span className="flex items-center gap-1"><MapPin size={13} />{party.region.name}</span>
                <span>{party.game.name}</span>
                <span className="flex items-center gap-1">
                  <SkillBadge skill={party.min_skill} />
                  {party.min_skill !== party.max_skill && <><span>→</span><SkillBadge skill={party.max_skill} /></>}
                </span>
              </div>
            </div>

            {/* Actions */}
            {isMember && (
              <div className="flex flex-wrap gap-2 shrink-0">
                <Button
                  variant={myMembership?.is_ready ? 'success' : 'secondary'}
                  size="sm"
                  onClick={() => readyMutation.mutate()}
                  loading={readyMutation.isPending}
                >
                  <CheckCircle2 size={14} />
                  {myMembership?.is_ready ? 'Ready!' : 'Ready Up'}
                </Button>

                {discordChannel ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => window.open(discordChannel.invite_url, '_blank')}
                  >
                    <MessageSquare size={14} /> Join Discord
                  </Button>
                ) : isLeader ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => createDiscordMutation.mutate()}
                    loading={createDiscordMutation.isPending}
                  >
                    <MessageSquare size={14} /> Create Discord
                  </Button>
                ) : null}

                {isLeader ? (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => { if (confirm('Disband party?')) disbandMutation.mutate(); }}
                    loading={disbandMutation.isPending}
                  >
                    <Trash2 size={14} /> Delete
                  </Button>
                ) : (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => leaveMutation.mutate()}
                    loading={leaveMutation.isPending}
                  >
                    <LogOut size={14} /> Leave
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Slots */}
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="font-display text-lg font-semibold text-text-primary">
                Members ({party.members.length}/{party.max_size})
              </h2>
              {party.members.every((m) => m.is_ready) && party.members.length >= 2 && (
                <span className="text-xs font-bold text-accent-success bg-accent-success/10 border border-accent-success/30 px-2 py-0.5 rounded-full">
                  All Ready!
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {slots.map((member, i) => (
                <PartySlot
                  key={i}
                  member={member}
                  isLeader={member?.player.id === party.leader.id}
                  index={i}
                  canKick={isLeader && !!member && member.player.id !== player?.id}
                  onKick={() => member && kickMutation.mutate(member.player.id)}
                />
              ))}
            </div>
          </div>

          {/* Discord password — leader only */}
          {isLeader && discordChannel?.password && (
            <div className="card p-4 border border-accent-primary/20 bg-accent-primary/5">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare size={14} className="text-accent-primary" />
                <span className="text-sm font-semibold text-text-primary">Discord Channel Password</span>
                <span className="text-xs text-text-muted">(only you can see this)</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 rounded-lg bg-bg-elevated border border-bg-border text-accent-primary font-mono text-sm tracking-widest select-all">
                  {discordChannel.password}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(discordChannel.password!);
                    toast.success('Password copied!');
                  }}
                  className="px-3 py-2 rounded-lg text-xs font-medium border border-bg-border text-text-secondary hover:text-text-primary hover:border-accent-primary/40 transition-colors"
                >
                  Copy
                </button>
              </div>
              <p className="text-xs text-text-muted mt-2">Share this password with players you want to invite to the Discord channel.</p>
            </div>
          )}

          {/* Party details */}
          <div className="card p-4 text-sm text-text-secondary">
            <p>
              <span className="text-text-muted">Leader: </span>
              <span className="text-text-primary font-medium">{party.leader.username}</span>
              <Crown size={12} className="inline ml-1 text-accent-warning" />
            </p>
            <p className="mt-1">
              <span className="text-text-muted">Status: </span>
              <span className={`font-medium ${party.status === 'OPEN' ? 'text-accent-success' : 'text-accent-warning'}`}>
                {party.status}
              </span>
            </p>
          </div>
        </div>

        {/* Right: Chat */}
        <div className="w-80 xl:w-96 shrink-0 border-l border-bg-border overflow-hidden">
          <ChatPanel
            currentPlayerId={player?.id ?? ''}
            onSend={sendMessage}
          />
        </div>
      </div>
    </div>
  );
}
