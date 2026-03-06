import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Gamepad2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/authStore';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const COUNTRY_CODES = ['IL', 'US', 'GB', 'DE', 'FR', 'TR', 'SA', 'AE', 'PL', 'RU', 'BR', 'AU', 'CA', 'KR', 'JP'] as const;

export default function AuthPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const { login, register: registerUser, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const registerSchema = z.object({
    username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, t('auth.validationUsername')),
    email: z.string().email(),
    password: z.string().min(8, t('auth.validationPassword')),
    country_code: z.string().length(2).optional().or(z.literal('')),
  });

  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
  });

  type RegisterForm = z.infer<typeof registerSchema>;
  type LoginForm = z.infer<typeof loginSchema>;

  const registerForm = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });
  const loginForm = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const handleLogin = async (data: LoginForm) => {
    try {
      await login(data);
      toast.success(t('auth.welcomeBack'));
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err?.response?.data?.detail ?? t('auth.loginFailed'));
    }
  };

  const handleRegister = async (data: RegisterForm) => {
    try {
      await registerUser({
        ...data,
        country_code: data.country_code || undefined,
      });
      toast.success(t('auth.accountCreated'));
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err?.response?.data?.detail ?? t('auth.registrationFailed'));
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 font-display text-3xl font-bold text-gradient">
            <Gamepad2 size={30} className="text-accent-primary" />
            {t('brand')}
          </div>
          <p className="text-text-secondary text-sm mt-2">{t('auth.tagline')}</p>
        </div>

        <div className="card p-6">
          <div className="flex gap-1 mb-6 p-1 bg-bg-elevated rounded-lg">
            {(['login', 'register'] as const).map((tabValue) => (
              <button
                key={tabValue}
                onClick={() => setTab(tabValue)}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                  tab === tabValue
                    ? 'bg-accent-primary text-white shadow-glow'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {tabValue === 'login' ? t('auth.login') : t('auth.register')}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === 'login' ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.15 }}
                onSubmit={loginForm.handleSubmit(handleLogin)}
                className="flex flex-col gap-4"
              >
                <Input
                  label={t('auth.email')}
                  type="email"
                  placeholder={t('auth.emailPlaceholder')}
                  {...loginForm.register('email')}
                  error={loginForm.formState.errors.email?.message}
                />
                <Input
                  label={t('auth.password')}
                  type="password"
                  placeholder={t('auth.passwordPlaceholder')}
                  {...loginForm.register('password')}
                  error={loginForm.formState.errors.password?.message}
                />
                <Button type="submit" variant="primary" size="lg" loading={isLoading} className="w-full mt-2">
                  {t('auth.login')}
                </Button>
              </motion.form>
            ) : (
              <motion.form
                key="register"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                onSubmit={registerForm.handleSubmit(handleRegister)}
                className="flex flex-col gap-4"
              >
                <Input
                  label={t('auth.username')}
                  placeholder={t('auth.usernamePlaceholder')}
                  {...registerForm.register('username')}
                  error={registerForm.formState.errors.username?.message}
                />
                <Input
                  label={t('auth.email')}
                  type="email"
                  placeholder={t('auth.emailPlaceholder')}
                  {...registerForm.register('email')}
                  error={registerForm.formState.errors.email?.message}
                />
                <Input
                  label={t('auth.password')}
                  type="password"
                  placeholder={t('auth.minChars')}
                  {...registerForm.register('password')}
                  error={registerForm.formState.errors.password?.message}
                />
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-text-secondary">{t('auth.country')}</label>
                  <select
                    {...registerForm.register('country_code')}
                    className="w-full px-3 py-2 rounded-lg text-sm bg-bg-elevated border border-bg-border text-text-primary focus:outline-none focus:border-accent-primary"
                  >
                    <option value="">{t('auth.selectCountry')}</option>
                    {COUNTRY_CODES.map((code) => (
                      <option key={code} value={code}>{t(`countries.${code}`)}</option>
                    ))}
                  </select>
                </div>
                <Button type="submit" variant="primary" size="lg" loading={isLoading} className="w-full mt-2">
                  {t('auth.createAccount')}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
