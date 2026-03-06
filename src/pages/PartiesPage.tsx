import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/authStore';
import { partiesApi } from '../api/parties';
import { gamesApi } from '../api/games';
import { regionsApi } from '../api/regions';
import Navbar from '../components/layout/Navbar';
import PartyCard from '../components/party/PartyCard';
import GameSelector from '../components/filters/GameSelector';
import RegionSelector from '../components/filters/RegionSelector';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Spinner from '../components/ui/Spinner';
import type { SkillLevel } from '../types/domain';

const SKILLS: SkillLevel[] = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'MASTER'];

export default function PartiesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { player } = useAuthStore();

  const [gameFilter, setGameFilter] = useState<string | null>(null);
  const [regionFilter, setRegionFilter] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const [form, setForm] = useState({
    game_id: '',
    region_id: '',
    name: '',
    max_size: 4,
    min_skill: 'BRONZE' as SkillLevel,
    max_skill: 'MASTER' as SkillLevel,
    is_public: true,
  });

  const { data: parties, isLoading } = useQuery({
    queryKey: ['parties', gameFilter, regionFilter],
    queryFn: () =>
      partiesApi.listParties({
        ...(gameFilter && { game_id: gameFilter }),
        ...(regionFilter && { region_code: regionFilter }),
        limit: 20,
      }),
  });

  const { data: games } = useQuery({ queryKey: ['games'], queryFn: gamesApi.getGames, staleTime: Infinity });
  const { data: regions } = useQuery({ queryKey: ['regions'], queryFn: regionsApi.getRegions, staleTime: Infinity });

  const joinMutation = useMutation({
    mutationFn: partiesApi.joinParty,
    onSuccess: (party) => {
      toast.success(t('parties.joinedParty'));
      navigate(`/parties/${party.id}`);
    },
    onError: (err: any) => toast.error(err?.response?.data?.detail ?? t('parties.failedToJoin')),
  });

  const createMutation = useMutation({
    mutationFn: partiesApi.createParty,
    onSuccess: (party) => {
      toast.success(t('parties.partyCreated'));
      queryClient.invalidateQueries({ queryKey: ['parties'] });
      setCreateOpen(false);
      navigate(`/parties/${party.id}`);
    },
    onError: (err: any) => toast.error(err?.response?.data?.detail ?? t('parties.failedToCreate')),
  });

  const deleteMutation = useMutation({
    mutationFn: partiesApi.disbandParty,
    onSuccess: () => {
      toast.success(t('parties.partyDeleted'));
      queryClient.invalidateQueries({ queryKey: ['parties'] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.detail ?? t('parties.failedToDelete')),
  });

  const handleCreate = () => {
    if (!form.game_id || !form.region_id) {
      toast.error(t('parties.selectGameAndRegion'));
      return;
    }
    createMutation.mutate({
      game_id: form.game_id,
      region_id: form.region_id,
      name: form.name || undefined,
      max_size: form.max_size,
      min_skill: form.min_skill,
      max_skill: form.max_skill,
      is_public: form.is_public,
    });
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl font-bold text-text-primary">{t('parties.openParties')}</h1>
          <Button variant="primary" size="sm" onClick={() => setCreateOpen(true)}>
            <Plus size={15} /> {t('parties.createParty')}
          </Button>
        </div>

        {/* Filters */}
        <div className="card p-4 mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <p className="text-xs text-text-secondary mb-2">{t('parties.filterByGame')}</p>
            <GameSelector value={gameFilter} onChange={setGameFilter} />
          </div>
          <div className="flex-1">
            <p className="text-xs text-text-secondary mb-2">{t('parties.filterByRegion')}</p>
            <RegionSelector value={regionFilter} onChange={setRegionFilter} />
          </div>
        </div>

        {/* Parties grid */}
        {isLoading ? (
          <div className="flex justify-center py-20"><Spinner size={32} /></div>
        ) : !parties?.length ? (
          <div className="text-center py-20">
            <Users size={40} className="mx-auto mb-3 text-text-muted opacity-40" />
            <p className="text-text-muted mb-4">{t('parties.noParties')}</p>
            <Button variant="primary" onClick={() => setCreateOpen(true)}>
              <Plus size={15} /> {t('parties.createParty')}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {parties.map((p) => (
              <PartyCard
                key={p.id}
                party={p}
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

      {/* Create Party Modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title={t('parties.createAParty')} maxWidth="max-w-md">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-secondary">{t('parties.gameRequired')}</label>
            <select
              value={form.game_id}
              onChange={(e) => setForm({ ...form, game_id: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm bg-bg-elevated border border-bg-border text-text-primary focus:outline-none focus:border-accent-primary"
            >
              <option value="">{t('parties.selectGame')}</option>
              {games?.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-secondary">{t('parties.regionRequired')}</label>
            <select
              value={form.region_id}
              onChange={(e) => setForm({ ...form, region_id: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm bg-bg-elevated border border-bg-border text-text-primary focus:outline-none focus:border-accent-primary"
            >
              <option value="">{t('parties.selectRegion')}</option>
              {regions?.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-secondary">{t('parties.partyName')}</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={t('parties.partyNamePlaceholder')}
              className="w-full px-3 py-2 rounded-lg text-sm bg-bg-elevated border border-bg-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-sm font-medium text-text-secondary">{t('parties.maxSize')} {form.max_size}</label>
              <input
                type="range"
                min={2}
                max={6}
                value={form.max_size}
                onChange={(e) => setForm({ ...form, max_size: parseInt(e.target.value) })}
                className="accent-accent-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-text-secondary">{t('parties.minSkill')}</label>
              <select
                value={form.min_skill}
                onChange={(e) => setForm({ ...form, min_skill: e.target.value as SkillLevel })}
                className="w-full px-3 py-2 rounded-lg text-sm bg-bg-elevated border border-bg-border text-text-primary focus:outline-none focus:border-accent-primary"
              >
                {SKILLS.map((s) => <option key={s} value={s}>{t(`skill.${s}`)}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-text-secondary">{t('parties.maxSkill')}</label>
              <select
                value={form.max_skill}
                onChange={(e) => setForm({ ...form, max_skill: e.target.value as SkillLevel })}
                className="w-full px-3 py-2 rounded-lg text-sm bg-bg-elevated border border-bg-border text-text-primary focus:outline-none focus:border-accent-primary"
              >
                {SKILLS.map((s) => <option key={s} value={s}>{t(`skill.${s}`)}</option>)}
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_public}
              onChange={(e) => setForm({ ...form, is_public: e.target.checked })}
              className="accent-accent-primary"
            />
            <span className="text-sm text-text-secondary">{t('parties.publicParty')}</span>
          </label>

          <Button
            variant="primary"
            onClick={handleCreate}
            loading={createMutation.isPending}
          >
            {t('parties.createParty')}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
