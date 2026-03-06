import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Gamepad2, Users, Search, LogOut, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';
import PlayerAvatar from '../player/PlayerAvatar';

const AVAILABILITY_COLORS = {
  ONLINE: 'bg-green-400',
  LOOKING_FOR_PARTY: 'bg-accent-success animate-pulse',
  IN_GAME: 'bg-accent-warning',
  AWAY: 'bg-yellow-600',
  OFFLINE: 'bg-text-muted',
};

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { player, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleLanguage = () => {
    const next = i18n.language === 'he' ? 'en' : 'he';
    i18n.changeLanguage(next);
  };

  return (
    <nav className="sticky top-0 z-40 glass border-b border-bg-border">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 font-display text-xl font-bold text-gradient shrink-0">
          <Gamepad2 size={22} className="text-accent-primary" />
          {t('brand')}
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {[
            { to: '/dashboard', label: t('nav.dashboard'), icon: <Gamepad2 size={15} /> },
            { to: '/browse', label: t('nav.players'), icon: <Search size={15} /> },
            { to: '/parties', label: t('nav.parties'), icon: <Users size={15} /> },
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

        {/* Right: lang + avatar + logout */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggleLanguage}
            title={t(`language.${i18n.language === 'he' ? 'en' : 'he'}`)}
            className="p-1.5 text-text-muted hover:text-accent-primary transition-colors rounded-lg hover:bg-bg-elevated text-xs font-semibold flex items-center gap-1"
          >
            <Globe size={14} />
            {i18n.language === 'he' ? 'EN' : 'עב'}
          </button>

          {player && (
            <>
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
                title={t('nav.logout')}
                className="p-1.5 text-text-muted hover:text-accent-danger transition-colors rounded-lg hover:bg-bg-elevated"
              >
                <LogOut size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
