import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { LogIn, UserPlus, Crown, Shield, User, BarChart2, TrendingUp, ArrowRight } from 'lucide-react';

const QUICK_ACCOUNTS = [
  {
    role: 'CEO',
    email: 'ceo@example.com',
    password: 'ceo123',
    icon: Crown,
    iconColor: 'text-amber-500',
    bg: 'hover:border-amber-400/60 hover:bg-amber-500/5',
    desc: 'Все 5 разделов',
  },
  {
    role: 'Админ',
    email: 'admin@example.com',
    password: 'admin123',
    icon: Shield,
    iconColor: 'text-primary',
    bg: 'hover:border-primary/60 hover:bg-primary/5',
    desc: 'Данные + пользователи',
  },
  {
    role: 'Менеджер',
    email: 'manager.bishkek@example.com',
    password: 'manager123',
    icon: User,
    iconColor: 'text-emerald-500',
    bg: 'hover:border-emerald-400/60 hover:bg-emerald-500/5',
    desc: 'Свой регион',
  },
];

const Auth = () => {
  const { user, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { signIn, signUp } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center animate-pulse">
            <BarChart2 className="w-4 h-4 text-white" />
          </div>
          <p className="text-xs text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message === 'Invalid login credentials'
          ? 'Неверный email или пароль'
          : error.message);
      }
    } else {
      if (!fullName.trim()) {
        toast.error('Введите ФИО');
        setSubmitting(false);
        return;
      }
      const { error } = await signUp(email, password, fullName);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Проверьте email для подтверждения регистрации');
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* ── Левая панель (скрыта на мобиле) ── */}
      <div className="hidden lg:flex lg:w-[52%] bg-gradient-to-br from-primary/90 via-primary to-violet-700 relative flex-col justify-between p-12 overflow-hidden">
        {/* Декоративные круги */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute bottom-16 -left-16 w-64 h-64 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 right-8 w-32 h-32 bg-white/5 rounded-full" />

        {/* Логотип */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Sales Compass</span>
        </div>

        {/* Центральный контент */}
        <div className="relative z-10 space-y-6">
          <div className="space-y-3">
            <h2 className="text-4xl font-bold text-white leading-tight">
              Аналитика продаж<br />в реальном времени
            </h2>
            <p className="text-white/70 text-base leading-relaxed max-w-md">
              Следите за выручкой, эффективностью команды и ROI маркетинга — всё в одном дашборде.
            </p>
          </div>

          {/* Фичи */}
          <div className="space-y-3">
            {[
              { icon: TrendingUp, text: 'Воронка продаж и конверсия' },
              { icon: BarChart2, text: 'Сравнение план/факт по менеджерам' },
              { icon: Crown, text: 'Ролевой доступ: CEO · Админ · Менеджер' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-white/80 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/40 text-xs relative z-10">© 2025 Sales Compass</p>
      </div>

      {/* ── Правая панель — форма ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-[380px] fade-in">
          {/* Мобильный логотип */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <BarChart2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-foreground">Sales Compass</span>
          </div>

          <div className="mb-7">
            <h1 className="text-2xl font-bold text-foreground mb-1">
              {isLogin ? 'Добро пожаловать' : 'Создать аккаунт'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isLogin ? 'Войдите, чтобы продолжить' : 'Заполните данные для регистрации'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground/80">ФИО</label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Иванов Иван Иванович"
                  className="h-10"
                />
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground/80">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                required
                className="h-10"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground/80">Пароль</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="h-10"
              />
            </div>

            <Button type="submit" className="w-full h-10 font-semibold mt-2" disabled={submitting}>
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Загрузка...
                </span>
              ) : isLogin ? (
                <><LogIn className="w-4 h-4 mr-2" />Войти</>
              ) : (
                <><UserPlus className="w-4 h-4 mr-2" />Зарегистрироваться</>
              )}
            </Button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-xs text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
              >
                {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Быстрый вход */}
            {isLogin && (
              <div className="pt-3 border-t border-border/60">
                <p className="text-[10px] text-muted-foreground mb-3 font-semibold uppercase tracking-widest text-center">
                  Демо-вход
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {QUICK_ACCOUNTS.map(({ role, email: e, password: p, icon: Icon, iconColor, bg, desc }) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => { setEmail(e); setPassword(p); }}
                      className={`flex flex-col items-center gap-1 py-3 px-1 rounded-xl border border-border/60 transition-all duration-200 cursor-pointer ${bg}`}
                    >
                      <Icon className={`w-4 h-4 ${iconColor}`} />
                      <span className="text-[11px] font-semibold text-foreground">{role}</span>
                      <span className="text-[9px] text-muted-foreground text-center leading-tight">{desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
