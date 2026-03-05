import type { SkillLevel } from '../../types/domain';
import SkillBadge from '../player/SkillBadge';

const SKILLS: SkillLevel[] = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'MASTER'];

interface SkillFilterProps {
  value: SkillLevel | null;
  onChange: (skill: SkillLevel | null) => void;
}

export default function SkillFilter({ value, onChange }: SkillFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={`px-3 py-1 rounded-lg text-sm border transition-colors ${
          value === null
            ? 'bg-accent-primary/20 text-accent-primary border-accent-primary/40'
            : 'border-bg-border text-text-secondary hover:border-accent-primary/30'
        }`}
      >
        All
      </button>
      {SKILLS.map((skill) => (
        <button
          key={skill}
          onClick={() => onChange(skill === value ? null : skill)}
          className={`transition-all ${value === skill ? 'ring-1 ring-accent-primary ring-offset-1 ring-offset-bg-primary rounded-full' : ''}`}
        >
          <SkillBadge skill={skill} size="sm" />
        </button>
      ))}
    </div>
  );
}
