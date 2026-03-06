import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { playersApi } from '../api/players';
import Navbar from '../components/layout/Navbar';
import PlayerCard from '../components/player/PlayerCard';
import GameSelector from '../components/filters/GameSelector';
import RegionSelector from '../components/filters/RegionSelector';
import SkillFilter from '../components/filters/SkillFilter';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import type { SkillLevel, AvailabilityStatus } from '../types/domain';

const AVAIL_KEYS: (AvailabilityStatus | '')[] = ['', 'ONLINE', 'LOOKING_FOR_PARTY', 'IN_GAME'];

const PAGE_SIZE = 12;

export default function BrowsePlayersPage() {
  const { t } = useTranslation();
  const [gameId, setGameId] = useState<string | null>(null);
  const [regionCode, setRegionCode] = useState<string | null>(null);
  const [skillLevel, setSkillLevel] = useState<SkillLevel | null>(null);
  const [availability, setAvailability] = useState<AvailabilityStatus | ''>('');
  const [offset, setOffset] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const params = {
    ...(gameId && { game_id: gameId }),
    ...(regionCode && { region_code: regionCode }),
    ...(skillLevel && { skill_level: skillLevel }),
    ...(availability && { availability }),
    limit: PAGE_SIZE,
    offset,
  };

  const { data: players, isLoading, isFetching } = useQuery({
    queryKey: ['players', params],
    queryFn: () => playersApi.listPlayers(params),
  });

  const resetFilters = () => {
    setGameId(null);
    setRegionCode(null);
    setSkillLevel(null);
    setAvailability('');
    setOffset(0);
  };

  const hasFilters = !!(gameId || regionCode || skillLevel || availability);

  const availLabel = (key: AvailabilityStatus | ''): string => {
    if (key === '') return t('browse.anyStatus');
    return t(`availability.${key}`);
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl font-bold text-text-primary">{t('browse.title')}</h1>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowFilters((v) => !v)}
          >
            <SlidersHorizontal size={15} /> {t('browse.filters')}
            {hasFilters && (
              <span className="ml-1 w-2 h-2 rounded-full bg-accent-primary" />
            )}
          </Button>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="card p-4 mb-6 flex flex-col gap-4">
            <div>
              <p className="text-sm font-medium text-text-secondary mb-2">{t('browse.game')}</p>
              <GameSelector value={gameId} onChange={(v) => { setGameId(v); setOffset(0); }} />
            </div>
            <div>
              <p className="text-sm font-medium text-text-secondary mb-2">{t('browse.region')}</p>
              <RegionSelector value={regionCode} onChange={(v) => { setRegionCode(v); setOffset(0); }} />
            </div>
            <div>
              <p className="text-sm font-medium text-text-secondary mb-2">{t('browse.skill')}</p>
              <SkillFilter value={skillLevel} onChange={(v) => { setSkillLevel(v); setOffset(0); }} />
            </div>
            <div>
              <p className="text-sm font-medium text-text-secondary mb-2">{t('browse.status')}</p>
              <div className="flex flex-wrap gap-2">
                {AVAIL_KEYS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setAvailability(opt); setOffset(0); }}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                      availability === opt
                        ? 'bg-accent-primary/20 text-accent-primary border-accent-primary/40'
                        : 'border-bg-border text-text-secondary hover:border-accent-primary/30'
                    }`}
                  >
                    {availLabel(opt)}
                  </button>
                ))}
              </div>
            </div>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={resetFilters} className="self-start">
                {t('browse.clearFilters')}
              </Button>
            )}
          </div>
        )}

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center py-20"><Spinner size={32} /></div>
        ) : !players?.length ? (
          <div className="text-center py-20">
            <Search size={40} className="mx-auto mb-3 text-text-muted opacity-40" />
            <p className="text-text-muted">{t('browse.noPlayers')}</p>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={resetFilters} className="mt-4">
                {t('browse.clearFilters')}
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {players.map((p) => <PlayerCard key={p.id} player={p} />)}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-3 mt-8">
              {offset > 0 && (
                <Button variant="secondary" size="sm" onClick={() => setOffset((o) => Math.max(0, o - PAGE_SIZE))}>
                  {t('browse.previous')}
                </Button>
              )}
              {players.length === PAGE_SIZE && (
                <Button
                  variant="secondary"
                  size="sm"
                  loading={isFetching}
                  onClick={() => setOffset((o) => o + PAGE_SIZE)}
                >
                  {t('browse.loadMore')}
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
