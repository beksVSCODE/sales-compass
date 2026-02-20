import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Shield, Users } from 'lucide-react';

interface UserWithRole {
  user_id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'manager';
  region: string | null;
  category: string | null;
}

export function AdminPanel() {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    const { data: profiles } = await supabase.from('profiles').select('*');
    const { data: roles } = await supabase.from('user_roles').select('*');

    if (profiles && roles) {
      const merged = profiles.map((p: any) => {
        const userRole = roles.find((r: any) => r.user_id === p.user_id);
        return {
          user_id: p.user_id,
          email: p.email,
          full_name: p.full_name,
          role: (userRole?.role as 'admin' | 'manager') || 'manager',
          region: p.region,
          category: p.category,
        };
      });
      setUsers(merged);
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const updateRole = async (userId: string, newRole: 'admin' | 'manager') => {
    const { error } = await supabase
      .from('user_roles')
      .update({ role: newRole })
      .eq('user_id', userId);

    if (error) {
      toast.error('Ошибка изменения роли');
    } else {
      toast.success('Роль обновлена');
      fetchUsers();
    }
  };

  const updateUserField = async (userId: string, field: 'region' | 'category', value: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ [field]: value || null })
      .eq('user_id', userId);

    if (error) {
      toast.error('Ошибка обновления');
    } else {
      toast.success('Обновлено');
      fetchUsers();
    }
  };

  if (loading) return <div className="text-muted-foreground text-sm p-4">Загрузка пользователей...</div>;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Управление пользователями
        </CardTitle>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <p className="text-muted-foreground text-sm">Нет пользователей</p>
        ) : (
          <div className="space-y-3">
            {users.map((u) => (
              <div key={u.user_id} className="flex items-center justify-between rounded-lg border border-border p-3 gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm font-medium truncate">{u.full_name || u.email}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 ml-5.5">{u.email}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Select
                    value={u.region || ''}
                    onValueChange={(v) => updateUserField(u.user_id, 'region', v)}
                  >
                    <SelectTrigger className="w-[130px] h-8 text-xs">
                      <SelectValue placeholder="Регион" />
                    </SelectTrigger>
                    <SelectContent>
                      {['Бишкек', 'Ош', 'Джалал-Абад', 'Каракол', 'Нарын', 'Талас'].map((r) => (
                        <SelectItem key={r} value={r} className="text-xs">{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={u.category || ''}
                    onValueChange={(v) => updateUserField(u.user_id, 'category', v)}
                  >
                    <SelectTrigger className="w-[130px] h-8 text-xs">
                      <SelectValue placeholder="Категория" />
                    </SelectTrigger>
                    <SelectContent>
                      {['CRM-системы', 'Аналитика', 'Маркетинг', 'Поддержка', 'Обучение', 'Интеграции'].map((c) => (
                        <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={u.role}
                    onValueChange={(v) => updateRole(u.user_id, v as 'admin' | 'manager')}
                  >
                    <SelectTrigger className="w-[110px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin" className="text-xs">Админ</SelectItem>
                      <SelectItem value="manager" className="text-xs">Менеджер</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
