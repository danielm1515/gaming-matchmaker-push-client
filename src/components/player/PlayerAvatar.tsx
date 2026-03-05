import type { Player } from '../../types/domain';

interface PlayerAvatarProps {
  player: Pick<Player, 'username' | 'avatar_url'>;
  size?: number;
  className?: string;
}

export default function PlayerAvatar({ player, size = 40, className = '' }: PlayerAvatarProps) {
  const initials = player.username.slice(0, 2).toUpperCase();

  if (player.avatar_url) {
    return (
      <img
        src={player.avatar_url}
        alt={player.username}
        style={{ width: size, height: size }}
        className={`rounded-full object-cover ${className}`}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.35 }}
      className={`rounded-full bg-gradient-to-br from-accent-primary to-purple-800 flex items-center justify-center font-bold text-white ${className}`}
    >
      {initials}
    </div>
  );
}
