import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { LogIn, UserPlus } from 'lucide-react';

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
        <div className="text-muted-foreground text-sm">Загрузка...</div>
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
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold">Анализ продаж</CardTitle>
          <CardDescription>
            {isLogin ? 'Войдите в систему' : 'Создайте аккаунт'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">ФИО</label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Иванов Иван Иванович"
                />
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Пароль</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {isLogin ? (
                <><LogIn className="w-4 h-4 mr-2" /> Войти</>
              ) : (
                <><UserPlus className="w-4 h-4 mr-2" /> Зарегистрироваться</>
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
