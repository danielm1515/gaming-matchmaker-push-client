import { Plus, CheckCircle2, Crown, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { PartyMember } from '../../types/domain';
import PlayerAvatar from '../player/PlayerAvatar';
import SkillBadge from '../player/SkillBadge';

interface PartySlotProps {
  member?: PartyMember;
  isLeader?: boolean;
  index: number;
  canKick?: boolean;
  onKick?: () => void;
}

export default function PartySlot({ member, isLeader, index, canKick, onKick }: PartySlotProps) {
  const { t } = useTranslation();

  if (!member) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05 }}
        className="flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-bg-border text-text-muted"
      >
        <div className="w-10 h-10 rounded-full border-2 border-dashed border-bg-border flex items-center justify-center">
          <Plus size={16} />
        </div>
        <span className="text-sm">{t('partySlot.openSlot')}</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
        member.is_ready
          ? 'border-accent-success/40 bg-accent-success/5 shadow-glow-green'
          : 'border-bg-border bg-bg-elevated'
      }`}
    >
      <div className="relative shrink-0">
        <PlayerAvatar player={member.player} size={40} />
        {isLeader && (
          <Crown
            size={13}
            className="absolute -top-1.5 -right-1 text-accent-warning fill-accent-warning"
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-sm text-text-primary truncate">
            {member.player.username}
          </span>
          {member.is_ready && <CheckCircle2 size={14} className="text-accent-success shrink-0" />}
        </div>
        <SkillBadge skill={member.player.skill_level} size="sm" />
      </div>

      {canKick && !isLeader && (
        <button
          onClick={onKick}
          title={t('partySlot.kickPlayer')}
          className="shrink-0 p-1 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors"
        >
          <X size={15} />
        </button>
      )}
    </motion.div>
  );
}
