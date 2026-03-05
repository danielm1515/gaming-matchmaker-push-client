import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Trash2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';
import { playersApi } from '../api/players';
import { gamesApi } from '../api/games';
import { regionsApi } from '../api/regions';
import Navbar from '../components/layout/Navbar';
import PlayerAvatar from '../components/player/PlayerAvatar';
import SkillBadge from '../components/player/SkillBadge';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import type { SkillLevel } from '../types/domain';

const SKILLS: SkillLevel[] = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'MASTER'];

const profileSchema = z.object({
  username: z.string().min(3).max(30).optional(),
  bio: z.string().max(500).optional(),
  country_code: z.string().length(2).optional().or(z.literal('')),
  skill_level: z.enum(['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'MASTER']).optional(),
  avatar_url: z.string().url().optional().or(z.literal('')),
  region_id: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { player, updatePlayer } = useAuthStore();
  const [addGameOpen, setAddGameOpen] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<SkillLevel>('SILVER');

  const { data: games } = useQuery({ queryKey: ['games'], queryFn: gamesApi.getGames, staleTime: Infinity });
  const { data: regions } = useQuery({ queryKey: ['regions'], queryFn: regionsApi.getRegions, staleTime: Infinity });

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (player) {
      reset({
        username: player.username,
        bio: player.bio ?? '',
        country_code: player.country_code ?? '',
        skill_level: player.skill_level,
        avatar_url: player.avatar_url ?? '',
        region_id: player.region?.id ?? '',
      });
    }
  }, [player, reset]);

  const updateMutation = useMutation({
    mutationFn: playersApi.updateMe,
    onSuccess: (updated) => {
      updatePlayer(updated);
      toast.success('Profile saved!');
    },
    onError: (err: any) => toast.error(err?.response?.data?.detail ?? 'Save failed'),
  });

  const addGameMutation = useMutation({
    mutationFn: playersApi.addGame,
    onSuccess: (updated) => {
      updatePlayer(updated);
      setAddGameOpen(false);
      toast.success('Game added!');
    },
    onError: (err: any) => toast.error(err?.response?.data?.detail ?? 'Failed to add game'),
  });

  const removeGameMutation = useMutation({
    mutationFn: playersApi.removeGame,
    onSuccess: (updated) => {
      updatePlayer(updated);
      toast.success('Game removed');
    },
    onError: () => toast.error('Failed to remove game'),
  });

  const onSubmit = (data: ProfileForm) => {
    const payload: any = {};
    if (data.username) payload.username = data.username;
    if (data.bio !== undefined) payload.bio = data.bio;
    if (data.country_code) payload.country_code = data.country_code.toUpperCase();
    if (data.skill_level) payload.skill_level = data.skill_level;
    if (data.avatar_url) payload.avatar_url = data.avatar_url;
    if (data.region_id) payload.region_id = data.region_id;
    updateMutation.mutate(payload);
  };

  const availableGames = games?.filter(
    (g) => !player?.player_games.find((pg) => pg.game.id === g.id)
  ) ?? [];

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold text-text-primary mb-8">Your Profile</h1>

        <div className="flex flex-col gap-6">
          {/* Avatar preview */}
          <div className="card p-6 flex items-center gap-6">
            {player && <PlayerAvatar player={player} size={72} />}
            <div>
              <h2 className="font-display text-xl font-semibold text-text-primary">{player?.username}</h2>
              <p className="text-text-secondary text-sm">Member since {new Date(player?.created_at ?? '').toLocaleDateString()}</p>
              {player && <SkillBadge skill={player.skill_level} size="md" />}
            </div>
          </div>

          {/* Edit form */}
          <form onSubmit={handleSubmit(onSubmit)} className="card p-6 flex flex-col gap-4">
            <h3 className="font-display text-lg font-semibold text-text-primary">Edit Details</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Username" {...register('username')} error={errors.username?.message} />
              <Input label="Avatar URL" placeholder="https://..." {...register('avatar_url')} />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-text-secondary">Bio</label>
              <textarea
                {...register('bio')}
                rows={3}
                placeholder="Tell your squad about yourself…"
                className="w-full px-3 py-2 rounded-lg text-sm bg-bg-elevated border border-bg-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-text-secondary">Skill Level</label>
                <select
                  {...register('skill_level')}
                  className="w-full px-3 py-2 rounded-lg text-sm bg-bg-elevated border border-bg-border text-text-primary focus:outline-none focus:border-accent-primary"
                >
                  {SKILLS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-text-secondary">Region</label>
                <select
                  {...register('region_id')}
                  className="w-full px-3 py-2 rounded-lg text-sm bg-bg-elevated border border-bg-border text-text-primary focus:outline-none focus:border-accent-primary"
                >
                  <option value="">Select region</option>
                  {regions?.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-text-secondary">Country Code (e.g. IL, US)</label>
              <Input
                placeholder="IL"
                maxLength={2}
                {...register('country_code')}
                error={errors.country_code?.message}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={updateMutation.isPending}
              disabled={!isDirty}
              className="self-start"
            >
              Save Changes
            </Button>
          </form>

          {/* My Games */}
          <div className="card p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-text-primary">My Games</h3>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setAddGameOpen(true)}
                disabled={availableGames.length === 0}
              >
                <Plus size={14} /> Add Game
              </Button>
            </div>

            {player?.player_games.length === 0 ? (
              <p className="text-text-muted text-sm">No games added yet.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {player?.player_games.map((pg) => (
                  <div key={pg.game.id} className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated border border-bg-border">
                    <div>
                      <span className="font-medium text-text-primary text-sm">{pg.game.name}</span>
                      <div className="mt-1"><SkillBadge skill={pg.skill_level} /></div>
                    </div>
                    <button
                      onClick={() => removeGameMutation.mutate(pg.game.id)}
                      className="p-1.5 text-text-muted hover:text-accent-danger transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Game Modal */}
        <Modal open={addGameOpen} onClose={() => setAddGameOpen(false)} title="Add a Game">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-text-secondary">Game</label>
              <select
                value={selectedGameId}
                onChange={(e) => setSelectedGameId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm bg-bg-elevated border border-bg-border text-text-primary focus:outline-none focus:border-accent-primary"
              >
                <option value="">Select a game</option>
                {availableGames.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-text-secondary">Your Skill Level</label>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSkill(s)}
                    className={`transition-all ${selectedSkill === s ? 'ring-1 ring-accent-primary ring-offset-1 ring-offset-bg-secondary rounded-full' : ''}`}
                  >
                    <SkillBadge skill={s} size="sm" />
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="primary"
              loading={addGameMutation.isPending}
              disabled={!selectedGameId}
              onClick={() => addGameMutation.mutate({ game_id: selectedGameId, skill_level: selectedSkill })}
            >
              Add Game
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
