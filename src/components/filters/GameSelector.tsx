import { useQuery } from '@tanstack/react-query';
import { gamesApi } from '../../api/games';
import type { Game } from '../../types/domain';
import Spinner from '../ui/Spinner';

interface GameSelectorProps {
  value: string | null;
  onChange: (gameId: string | null) => void;
  placeholder?: string;
}

export default function GameSelector({ value, onChange, placeholder = 'All Games' }: GameSelectorProps) {
  const { data: games, isLoading } = useQuery({
    queryKey: ['games'],
    queryFn: gamesApi.getGames,
    staleTime: Infinity,
  });

  if (isLoading) return <Spinner size={16} />;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
          value === null
            ? 'bg-accent-primary/20 text-accent-primary border-accent-primary/40'
            : 'border-bg-border text-text-secondary hover:border-accent-primary/30 hover:text-text-primary'
        }`}
      >
        {placeholder}
      </button>
      {games?.map((game: Game) => (
        <button
          key={game.id}
          onClick={() => onChange(game.id)}
          className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
            value === game.id
              ? 'bg-accent-primary/20 text-accent-primary border-accent-primary/40'
              : 'border-bg-border text-text-secondary hover:border-accent-primary/30 hover:text-text-primary'
          }`}
        >
          {game.name}
        </button>
      ))}
    </div>
  );
}
