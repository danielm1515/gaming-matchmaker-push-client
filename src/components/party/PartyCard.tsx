import { useNavigate } from 'react-router-dom';
import { Users, MapPin, Swords, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { Party } from '../../types/domain';
import SkillBadge from '../player/SkillBadge';
import PlayerAvatar from '../player/PlayerAvatar';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface PartyCardProps {
  party: Party;
  onJoin?: (partyId: string) => void;
  onDelete?: (partyId: string) => void;
  currentPlayerId?: string;
  matchScore?: number;
  isJoining?: boolean;
  isDeleting?: boolean;
}

const STATUS_COLOR: Record<string, 'green' | 'red' | 'yellow' | 'grey'> = {
  OPEN: 'green',
  FULL: 'red',
  IN_GAME: 'yellow',
  DISBANDED: 'grey',
};

export default function PartyCard({ party, onJoin, onDelete, currentPlayerId, matchScore, isJoining, isDeleting }: PartyCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const currentSize = party.members.length;
  const isFull = currentSize >= party.max_size;
  const isMyParty = !!currentPlayerId && party.leader.id === currentPlayerId;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="card p-4 flex flex-col gap-3 cursor-default"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display font-semibold text-text-primary">
              {party.name || `${party.game.name} ${t('partyCard.party')}`}
            </span>
            <Badge color={STATUS_COLOR[party.status]}>{party.status}</Badge>
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs text-text-secondary">
            <Swords size={11} />
            <span>{party.game.name}</span>
          </div>
        </div>
        {matchScore !== undefined && (
          <span className="text-xs font-bold text-accent-success bg-accent-success/10 border border-accent-success/30 px-2 py-0.5 rounded-full shrink-0">
            {matchScore}{t('partyCard.match')}
          </span>
        )}
      </div>

      {/* Region + Skill */}
      <div className="flex items-center gap-3 text-xs text-text-secondary">
        <span className="flex items-center gap-1">
          <MapPin size={11} />
          {party.region.name}
        </span>
        <span className="flex items-center gap-1">
          <SkillBadge skill={party.min_skill} size="sm" />
          {party.min_skill !== party.max_skill && (
            <>→ <SkillBadge skill={party.max_skill} size="sm" /></>
          )}
        </span>
      </div>

      {/* Slots */}
      <div className="flex items-center gap-1.5">
        <Users size={13} className="text-text-muted" />
        <span className="text-sm text-text-secondary mr-2">{currentSize}/{party.max_size}</span>
        <div className="flex gap-1">
          {Array.from({ length: party.max_size }).map((_, i) => {
            const member = party.members[i];
            return member ? (
              <PlayerAvatar key={i} player={member.player} size={22} />
            ) : (
              <div
                key={i}
                className="w-[22px] h-[22px] rounded-full border-2 border-dashed border-bg-border"
              />
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        <Button
          variant="ghost"
          size="sm"
          className="flex-1"
          onClick={() => navigate(`/parties/${party.id}`)}
        >
          {t('partyCard.view')}
        </Button>
        {onJoin && !isFull && !isMyParty && (
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            onClick={() => onJoin(party.id)}
            loading={isJoining}
          >
            {t('partyCard.join')}
          </Button>
        )}
        {onDelete && isMyParty && (
          <Button
            variant="danger"
            size="sm"
            className="flex-1"
            onClick={() => { if (confirm(t('partyCard.deleteConfirm'))) onDelete(party.id); }}
            loading={isDeleting}
          >
            <Trash2 size={13} /> {t('partyCard.delete')}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
