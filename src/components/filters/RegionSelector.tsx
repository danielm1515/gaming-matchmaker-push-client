import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { regionsApi } from '../../api/regions';
import type { Region } from '../../types/domain';
import Spinner from '../ui/Spinner';

interface RegionSelectorProps {
  value: string | null;
  onChange: (regionCode: string | null) => void;
  asDropdown?: boolean;
}

export default function RegionSelector({ value, onChange, asDropdown = false }: RegionSelectorProps) {
  const { t } = useTranslation();
  const { data: regions, isLoading } = useQuery({
    queryKey: ['regions'],
    queryFn: regionsApi.getRegions,
    staleTime: Infinity,
  });

  if (isLoading) return <Spinner size={16} />;

  if (asDropdown) {
    return (
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || null)}
        className="w-full px-3 py-2 rounded-lg text-sm bg-bg-elevated border border-bg-border text-text-primary focus:outline-none focus:border-accent-primary"
      >
        <option value="">{t('filters.allRegions')}</option>
        {regions?.map((r: Region) => (
          <option key={r.id} value={r.code}>{r.name}</option>
        ))}
      </select>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
          value === null
            ? 'bg-accent-primary/20 text-accent-primary border-accent-primary/40'
            : 'border-bg-border text-text-secondary hover:border-accent-primary/30'
        }`}
      >
        {t('filters.all')}
      </button>
      {regions?.map((r: Region) => (
        <button
          key={r.id}
          onClick={() => onChange(r.code)}
          className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
            value === r.code
              ? 'bg-accent-primary/20 text-accent-primary border-accent-primary/40'
              : 'border-bg-border text-text-secondary hover:border-accent-primary/30'
          }`}
        >
          {r.code}
        </button>
      ))}
    </div>
  );
}
