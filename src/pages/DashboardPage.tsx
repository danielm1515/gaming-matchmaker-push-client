import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Zap, Users, Search, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/authStore';
import { playersApi } from '../api/players';
import { partiesApi } from '../api/parties';
import { matchingApi } from '../api/matching';
import Navbar from '../components/layout/Navbar';
import PlayerCard from '../components/player/PlayerCard';
import PartyCard from '../components/party/PartyCard';
import GameSelector from '../components/filters/GameSelector';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import type { AvailabilityStatus } from '../types/domain';

const AVAILABILITY_KEYS: AvailabilityStatus[] = ['ONLINE', 'LOOKING_FOR_PARTY', 'IN_GAME', 'AWAY', 'OFFLINE'];

const AVAILABILITY_COLORS: Record<AvailabilityStatus, string> = {
  ONLINE: 'bg-green-400',
  LOOKING_FOR_PARTY: 'bg-accent-success',
  IN_GAME: 'bg-accent-warning',
  AWAY: 'bg-yellow-600',
  OFFLINE: 'bg-text-muted',
};

export default function DashboardPage() {
  const { t } = useTranslation();
  const { player, updatePlayer } = useAuthStore();
  const navigate = useNavigate();

  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [isFinding, setIsFinding] = useState(false);

  const { data: nearbyPlayers, isLoading: loadingPlayers } = useQuery({
    queryKey: ['players', 'nearby', player?.region?.code],
    queryFn: () =>
      playersApi.listPlayers({
        region_code: player?.region?.code,
        availability: 'LOOKING_FOR_PARTY',
        limit: 6,
      }),
    enabled: !!player,
  });

  const availabilityMutation = useMutation({
    mutationFn: (availability: AvailabilityStatus) =>
      playersApi.updateMe({ availability }),
    onSuccess: (updated) => {
      updatePlayer(updated);
      toast.success(t('dashboard.statusUpdated'));
    },
  });

  const joinMutation = useMutation({
    mutationFn: partiesApi.joinParty,
    onSuccess: (party) => {
      toast.success(t('dashboard.joinedParty'));
      navigate(`/parties/${party.id}`);
    },
    onError: (err: any) => toast.error(err?.response?.data?.detail ?? t('dashboard.failedToJoin')),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => partiesApi.disbandParty(id),
    onSuccess: (_data, id) => {
      toast.success(t('dashboard.partyDeleted'));
      setMatches((prev) => prev.filter((r) => r.party.id !== id));
    },
    onError: (err: any) => toast.error(err?.response?.data?.detail ?? t('dashboard.failedToDelete')),
  });

  const handleFindMatch = async () => {
    if (!selectedGameId) { toast.error(t('dashboard.selectGameFirst')); return; }
    setIsFinding(true);
    try {
      const results = await matchingApi.findMatches(selectedGameId, 2, 6);
      setMatches(results);
      if (!results.length) toast(t('dashboard.noMatches'), { icon: '🔍' });
    } catch {
      toast.error(t('dashboard.findMatchFailed'));
    } finally {
      setIsFinding(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-8">

        {/* Status bar */}
        <div className="card p-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <div>
            <p className="text-sm text-text-secondary mb-2">{t('dashboard.yourStatus')}</p>
            <div className="flex flex-wrap gap-2">
              {AVAILABILITY_KEYS.map((value) => (
                <button
                  key={value}
                  onClick={() => availabilityMutation.mutate(value)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border transition-all ${
                    player?.availability === value
                      ? 'border-accent-primary/50 bg-accent-primary/10 text-text-primary'
                      : 'border-bg-border text-text-secondary hover:border-accent-primary/30'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${AVAILABILITY_COLORS[value]}`} />
                  {t(`availability.${value}`)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick match */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Zap size={18} className="text-accent-primary" />
            <h2 className="font-display text-xl font-semibold text-text-primary">{t('dashboard.quickMatch')}</h2>
          </div>
          <div className="card p-4 flex flex-col gap-4">
            <GameSelector value={selectedGameId} onChange={setSelectedGameId} placeholder={t('dashboard.pickGame')} />
            <Button
              variant="primary"
              size="md"
              onClick={handleFindMatch}
              loading={isFinding}
              disabled={!selectedGameId}
              className="self-start"
            >
              <Zap size={15} /> {t('dashboard.findParty')}
            </Button>

            {matches.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                {matches.slice(0, 6).map((result) => (
                  <PartyCard
                    key={result.party.id}
                    party={result.party}
                    matchScore={result.match_score}
                    currentPlayerId={player?.id}
                    onJoin={(id) => joinMutation.mutate(id)}
                    isJoining={joinMutation.isPending}
                    onDelete={(id) => deleteMutation.mutate(id)}
                    isDeleting={deleteMutation.isPending}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Nearby players */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-accent-secondary" />
              <h2 className="font-display text-xl font-semibold text-text-primary">
                {t('dashboard.playersNearYou')}
              </h2>
            </div>
            <button
              onClick={() => navigate('/browse')}
              className="flex items-center gap-1 text-sm text-accent-primary hover:underline"
            >
              {t('dashboard.seeAll')} <ChevronRight size={14} />
            </button>
          </div>

          {loadingPlayers ? (
            <div className="flex justify-center py-12"><Spinner /></div>
          ) : nearbyPlayers?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {nearbyPlayers.map((p) => (
                <PlayerCard key={p.id} player={p} />
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center text-text-muted">
              <Search size={32} className="mx-auto mb-3 opacity-40" />
              <p>{t('dashboard.noPlayersNearby')}</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
