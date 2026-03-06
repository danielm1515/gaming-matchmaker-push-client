import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gamepad2, MapPin, MessageSquare, Users, Zap, Shield, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button';

const GAMES = [
  'Warzone', 'Fortnite', 'Apex Legends', 'Valorant',
  'League of Legends', 'Overwatch 2', 'CS2', 'Rocket League',
  'Warzone', 'Fortnite', 'Apex Legends', 'Valorant',
  'League of Legends', 'Overwatch 2', 'CS2', 'Rocket League',
];

export default function LandingPage() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const next = i18n.language === 'he' ? 'en' : 'he';
    i18n.changeLanguage(next);
  };

  const FEATURES = [
    {
      icon: <MapPin size={28} className="text-accent-primary" />,
      title: t('landing.regionMatching'),
      desc: t('landing.regionMatchingDesc'),
      color: 'from-accent-primary/20 to-transparent',
    },
    {
      icon: <MessageSquare size={28} className="text-accent-secondary" />,
      title: t('landing.realtimeChat'),
      desc: t('landing.realtimeChatDesc'),
      color: 'from-accent-secondary/20 to-transparent',
    },
    {
      icon: <Users size={28} className="text-accent-success" />,
      title: t('landing.smartParties'),
      desc: t('landing.smartPartiesDesc'),
      color: 'from-accent-success/20 to-transparent',
    },
    {
      icon: <Zap size={28} className="text-accent-warning" />,
      title: t('landing.quickMatch'),
      desc: t('landing.quickMatchDesc'),
      color: 'from-accent-warning/20 to-transparent',
    },
    {
      icon: <Shield size={28} className="text-purple-400" />,
      title: t('landing.skillGating'),
      desc: t('landing.skillGatingDesc'),
      color: 'from-purple-500/20 to-transparent',
    },
    {
      icon: <Globe size={28} className="text-pink-400" />,
      title: t('landing.multiGame'),
      desc: t('landing.multiGameDesc'),
      color: 'from-pink-500/20 to-transparent',
    },
  ];

  const STATS = [
    { value: '8+', label: t('landing.gamesSupported') },
    { value: '10', label: t('landing.globalRegions') },
    { value: '<50ms', label: t('landing.chatLatency') },
    { value: '∞', label: t('landing.freeForever') },
  ];

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-bg-border">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display text-xl font-bold text-gradient">
            <Gamepad2 size={22} className="text-accent-primary" />
            {t('brand')}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="p-1.5 text-text-muted hover:text-accent-primary transition-colors rounded-lg hover:bg-bg-elevated text-xs font-semibold flex items-center gap-1"
            >
              <Globe size={14} />
              {i18n.language === 'he' ? 'EN' : 'עב'}
            </button>
            <Link to="/auth">
              <Button variant="ghost" size="sm">{t('landing.login')}</Button>
            </Link>
            <Link to="/auth">
              <Button variant="primary" size="sm">{t('landing.getStarted')}</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-14">
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20 pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-primary/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-accent-secondary/6 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-primary/10 border border-accent-primary/30 text-accent-primary text-sm font-medium mb-6">
              <Zap size={13} className="fill-accent-primary" />
              {t('landing.badge')}
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              {t('landing.heroTitle1')}{' '}
              <span className="text-gradient">{t('landing.heroTitle2')}</span>
              <br />
              {t('landing.heroTitle3')}
            </h1>

            <p className="text-text-secondary text-lg sm:text-xl max-w-2xl mx-auto mb-10">
              {t('landing.heroDesc')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button variant="primary" size="lg" className="text-base px-8 shadow-glow animate-pulse-glow">
                  <Zap size={18} /> {t('landing.getStartedFree')}
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="secondary" size="lg" className="text-base px-8">
                  <Users size={18} /> {t('landing.browsePlayers')}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted animate-float">
          <div className="w-5 h-8 rounded-full border-2 border-text-muted flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 bg-text-muted rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Game marquee */}
      <section className="py-10 overflow-hidden border-y border-bg-border bg-bg-secondary">
        <div className="flex animate-marquee whitespace-nowrap gap-8">
          {GAMES.map((game, i) => (
            <span
              key={i}
              className="flex items-center gap-2 text-text-muted font-display font-semibold text-lg"
            >
              <Gamepad2 size={16} className="text-accent-primary opacity-60" />
              {game}
            </span>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="font-display text-4xl font-bold text-gradient">{stat.value}</div>
              <div className="text-text-secondary text-sm mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-4xl font-bold text-text-primary mb-4">
              {t('landing.featuresTitle')}
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              {t('landing.featuresDesc')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                className="card p-6 card-hover"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="font-display text-xl font-semibold text-text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-primary/5 to-transparent pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-2xl mx-auto"
        >
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-text-primary mb-6">
            {t('landing.ctaTitle')}
          </h2>
          <p className="text-text-secondary text-lg mb-8">
            {t('landing.ctaDesc')}
          </p>
          <Link to="/auth">
            <Button variant="primary" size="lg" className="text-base px-10 shadow-glow">
              <Zap size={18} /> {t('landing.startPlaying')}
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-bg-border py-8 px-4 text-center text-text-muted text-sm">
        <div className="flex items-center justify-center gap-2 font-display text-lg font-bold text-gradient mb-2">
          <Gamepad2 size={18} className="text-accent-primary" />
          {t('brand')}
        </div>
        <p>{t('landing.footer')} © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
