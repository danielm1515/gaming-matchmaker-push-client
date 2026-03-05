import { motion } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';
import type { Player } from '../../types/domain';
import PlayerAvatar from './PlayerAvatar';
import SkillBadge from './SkillBadge';

const AVAILABILITY_DOT: Record<string, string> = {
  ONLINE: 'bg-green-400',
  LOOKING_FOR_PARTY: 'bg-accent-success animate-pulse',
  IN_GAME: 'bg-accent-warning',
  AWAY: 'bg-yellow-600',
  OFFLINE: 'bg-text-muted',
};

const AVAILABILITY_LABEL: Record<string, string> = {
  ONLINE: 'Online',
  LOOKING_FOR_PARTY: 'Looking for party',
  IN_GAME: 'In game',
  AWAY: 'Away',
  OFFLINE: 'Offline',
};

interface PlayerCardProps {
  player: Player;
  onAction?: (player: Player) => void;
  actionLabel?: string;
}

export default function PlayerCard({ player, onAction, actionLabel = 'Invite' }: PlayerCardProps) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="card p-4 flex flex-col gap-3 cursor-default"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <PlayerAvatar player={player} size={44} />
          <span
            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-bg-secondary ${AVAILABILITY_DOT[player.availability]}`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-text-primary truncate">{player.username}</span>
            <SkillBadge skill={player.skill_level} />
          </div>
          <div className="flex items-center gap-1 text-xs text-text-muted mt-0.5">
            <span className={`w-1.5 h-1.5 rounded-full ${AVAILABILITY_DOT[player.availability]}`} />
            {AVAILABILITY_LABEL[player.availability]}
          </div>
        </div>
      </div>

      {/* Region */}
      {player.region && (
        <div className="flex items-center gap-1 text-xs text-text-secondary">
          <MapPin size={11} />
          {player.region.name}
          {player.country_code && ` · ${player.country_code}`}
        </div>
      )}

      {/* Games */}
      {player.player_games.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {player.player_games.slice(0, 3).map((pg) => (
            <span
              key={pg.game.id}
              className="px-2 py-0.5 rounded-md text-xs bg-bg-elevated text-text-secondary border border-bg-border"
            >
              {pg.game.name}
            </span>
          ))}
          {player.player_games.length > 3 && (
            <span className="px-2 py-0.5 rounded-md text-xs text-text-muted">
              +{player.player_games.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Action */}
      {onAction && (
        <button
          onClick={() => onAction(player)}
          className="mt-auto w-full py-1.5 rounded-lg text-sm font-medium text-accent-primary border border-accent-primary/30 hover:bg-accent-primary/10 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}
