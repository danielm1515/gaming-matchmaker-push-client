import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Gamepad2, Users, Search, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import PlayerAvatar from '../player/PlayerAvatar';
import { partiesApi } from '../../api/parties';
import { useQuery } from '@tanstack/react-query';

const AVAILABILITY_COLORS = {
  ONLINE: 'bg-green-400',
  LOOKING_FOR_PARTY: 'bg-accent-success animate-pulse',
  IN_GAME: 'bg-accent-warning',
  AWAY: 'bg-yellow-600',
  OFFLINE: 'bg-text-muted',
};

export default function Navbar() {
  const { player, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-40 glass border-b border-bg-border">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 font-display text-xl font-bold text-gradient shrink-0">
          <Gamepad2 size={22} className="text-accent-primary" />
          SquadUp
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {[
            { to: '/dashboard', label: 'Dashboard', icon: <Gamepad2 size={15} /> },
            { to: '/browse', label: 'Players', icon: <Search size={15} /> },
            { to: '/parties', label: 'Parties', icon: <Users size={15} /> },
          ].map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-accent-primary/20 text-accent-primary'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                }`
              }
            >
              {icon}
              <span className="hidden sm:inline">{label}</span>
            </NavLink>
          ))}
        </div>

        {/* Right: avatar + logout */}
        {player && (
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/profile"
              className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-bg-elevated transition-colors"
            >
              <div className="relative">
                <PlayerAvatar player={player} size={28} />
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-bg-secondary ${
                    AVAILABILITY_COLORS[player.availability]
                  }`}
                />
              </div>
              <span className="text-sm text-text-primary hidden sm:block">{player.username}</span>
            </Link>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 text-text-muted hover:text-accent-danger transition-colors rounded-lg hover:bg-bg-elevated"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
