import type { SkillLevel } from '../../types/domain';

const SKILL_CONFIG: Record<SkillLevel, { label: string; color: string }> = {
  BRONZE: { label: 'Bronze', color: 'bg-orange-900/40 text-orange-400 border-orange-700/40' },
  SILVER: { label: 'Silver', color: 'bg-zinc-700/40 text-zinc-300 border-zinc-600/40' },
  GOLD: { label: 'Gold', color: 'bg-yellow-900/40 text-yellow-400 border-yellow-700/40' },
  PLATINUM: { label: 'Platinum', color: 'bg-cyan-900/40 text-cyan-400 border-cyan-700/40' },
  DIAMOND: { label: 'Diamond', color: 'bg-blue-900/40 text-blue-400 border-blue-700/40' },
  MASTER: { label: 'Master', color: 'bg-purple-900/40 text-purple-400 border-purple-700/40' },
};

interface SkillBadgeProps {
  skill: SkillLevel;
  size?: 'sm' | 'md';
}

export default function SkillBadge({ skill, size = 'sm' }: SkillBadgeProps) {
  const { label, color } = SKILL_CONFIG[skill];
  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold ${color} ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
    >
      {label}
    </span>
  );
}
