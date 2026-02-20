import { useState } from 'react';
import { mockUsers } from '@/integrations/mockAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Shield, Users, Download, Settings, Database, Filter, Trash2, Edit2, Plus } from 'lucide-react';
import { FilterPresetsManager, type FilterPreset } from '@/lib/filterPresets';
import { categories, regions, clientTypes, periods } from '@/data/mockData';

interface UserWithRole {
  email: string;
  fullName: string;
  role: 'admin' | 'manager';
  region: string | null;
  category: string | null;
}

interface FilterFormState {
  name: string;
  description: string;
  period: string;
  selectedCategories: string[];
  selectedRegions: string[];
  selectedClientTypes: string[];
  isPublic: boolean;
}

const initializeUsers = (): UserWithRole[] => {
  try {
    return Object.entries(mockUsers).map(([email, data]) => ({
      email,
      fullName: data.profile.full_name || 'User',
      role: data.role,
      region: data.profile.region,
      category: data.profile.category,
    }));
  } catch (error) {
    console.error('Error initializing users:', error);
    return [];
  }
};

export function AdminPanel() {
  const usersList = initializeUsers();
  
  console.log('AdminPanel users:', usersList);
  console.log('mockUsers keys:', Object.keys(mockUsers));
  console.log('mockUsers:', mockUsers);

  const [users, setUsers] = useState<UserWithRole[]>(usersList);

  const [filterPresets, setFilterPresets] = useState<FilterPreset[]>(FilterPresetsManager.getAll());
  const [editingFilter, setEditingFilter] = useState<FilterPreset | null>(null);
  const [filterForm, setFilterForm] = useState<FilterFormState>({
    name: '',
    description: '',
    period: 'month',
    selectedCategories: [],
    selectedRegions: [],
    selectedClientTypes: [],
    isPublic: true,
  });
  const [showFilterForm, setShowFilterForm] = useState(false);

  const updateRole = (email: string, newRole: 'admin' | 'manager') => {
    const user = mockUsers[email];
    if (user) {
      user.role = newRole;
      setUsers(u => u.map(user => user.email === email ? { ...user, role: newRole } : user));
      toast.success(`Роль обновлена на "${newRole}"`);
    }
  };

  const updateUserField = (email: string, field: 'region' | 'category', value: string) => {
    const user = mockUsers[email];
    if (user) {
      const finalValue = value === 'all' ? null : value;
      if (field === 'region') {
        user.profile.region = finalValue;
      } else {
        user.profile.category = finalValue;
      }
      setUsers(u => u.map(user => 
        user.email === email 
          ? { ...user, [field]: finalValue } 
          : user
      ));
      toast.success(`${field === 'region' ? 'Регион' : 'Категория'} обновлены`);
    }
  };

  // Управление фильтрами
  const handleSaveFilter = () => {
    if (!filterForm.name.trim()) {
      toast.error('Введите название фильтра');
      return;
    }

    if (editingFilter) {
      const updated = FilterPresetsManager.update(editingFilter.id, {
        name: filterForm.name,
        description: filterForm.description,
        filters: {
          period: filterForm.period,
          categories: filterForm.selectedCategories,
          regions: filterForm.selectedRegions,
          clientTypes: filterForm.selectedClientTypes,
        },
        isPublic: filterForm.isPublic,
      });
      if (updated) {
        toast.success('Фильтр обновлен');
      }
    } else {
      FilterPresetsManager.create(
        filterForm.name,
        {
          period: filterForm.period,
          categories: filterForm.selectedCategories,
          regions: filterForm.selectedRegions,
          clientTypes: filterForm.selectedClientTypes,
        },
        'admin@example.com',
        filterForm.description,
        filterForm.isPublic
      );
      toast.success('Фильтр создан');
    }

    setFilterPresets(FilterPresetsManager.getAll());
    resetFilterForm();
  };

  const handleEditFilter = (preset: FilterPreset) => {
    setEditingFilter(preset);
    setFilterForm({
      name: preset.name,
      description: preset.description || '',
      period: preset.filters.period,
      selectedCategories: preset.filters.categories,
      selectedRegions: preset.filters.regions,
      selectedClientTypes: preset.filters.clientTypes,
      isPublic: preset.isPublic,
    });
    setShowFilterForm(true);
  };

  const handleDeleteFilter = (id: string) => {
    if (FilterPresetsManager.delete(id)) {
      setFilterPresets(FilterPresetsManager.getAll());
      toast.success('Фильтр удален');
    }
  };

  const resetFilterForm = () => {
    setEditingFilter(null);
    setFilterForm({
      name: '',
      description: '',
      period: 'month',
      selectedCategories: [],
      selectedRegions: [],
      selectedClientTypes: [],
      isPublic: true,
    });
    setShowFilterForm(false);
  };

  const toggleArrayValue = (arr: string[], value: string) => {
    return arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
  };

  return (
    <Tabs defaultValue="users" className="w-full space-y-4">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="users" className="text-xs">Пользователи</TabsTrigger>
        <TabsTrigger value="filters" className="text-xs">Фильтры</TabsTrigger>
        <TabsTrigger value="settings" className="text-xs">Настройки</TabsTrigger>
        <TabsTrigger value="crm" className="text-xs">CRM</TabsTrigger>
      </TabsList>

      {/* Управление пользователями */}
      <TabsContent value="users" className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Users className="w-4 h-4" />
              Управление пользователями ({users.length})
            </CardTitle>
            <CardDescription className="text-xs">
              Назначьте роли, регионы и категории пользователям
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {users.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">Нет пользователей для отображения</p>
              </div>
            ) : (
              users.map((user) => (
                <div
                  key={user.email}
                  className="flex items-center justify-between rounded-lg border border-border p-3 gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm font-medium truncate">{user.fullName}</span>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="text-xs flex-shrink-0">
                        {user.role === 'admin' ? 'Админ' : 'Менеджер'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 ml-5.5">{user.email}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Select
                      value={user.region || 'all'}
                      onValueChange={(v) => updateUserField(user.email, 'region', v)}
                    >
                      <SelectTrigger className="w-[130px] h-8 text-xs">
                        <SelectValue placeholder="Регион" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="text-xs">Все</SelectItem>
                        {regions.map((r) => (
                          <SelectItem key={r} value={r} className="text-xs">
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={user.category || 'all'}
                      onValueChange={(v) => updateUserField(user.email, 'category', v)}
                    >
                      <SelectTrigger className="w-[130px] h-8 text-xs">
                        <SelectValue placeholder="Категория" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="text-xs">Все</SelectItem>
                        {categories.map((c) => (
                          <SelectItem key={c} value={c} className="text-xs">
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={user.role}
                      onValueChange={(v) => updateRole(user.email, v as 'admin' | 'manager')}
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
              ))
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Управление фильтрами */}
      <TabsContent value="filters" className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Управление фильтрами ({filterPresets.length})
                </CardTitle>
                <CardDescription className="text-xs">
                  Создавайте, редактируйте и удаляйте предустановленные фильтры
                </CardDescription>
              </div>
              <Button
                size="sm"
                className="text-xs"
                onClick={() => {
                  resetFilterForm();
                  setShowFilterForm(true);
                }}
              >
                <Plus className="w-3 h-3 mr-1" />
                Новый фильтр
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Форма создания/редактирования */}
            {showFilterForm && (
              <div className="rounded-lg border border-border p-4 space-y-3 bg-muted/50">
                <h3 className="text-sm font-medium">
                  {editingFilter ? 'Редактировать фильтр' : 'Создать новый фильтр'}
                </h3>

                <div className="space-y-2">
                  <label className="text-xs font-medium">Название *</label>
                  <Input
                    value={filterForm.name}
                    onChange={(e) => setFilterForm({ ...filterForm, name: e.target.value })}
                    placeholder="Например: Месячная выручка B2B"
                    className="h-8 text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium">Описание</label>
                  <Input
                    value={filterForm.description}
                    onChange={(e) => setFilterForm({ ...filterForm, description: e.target.value })}
                    placeholder="Описание фильтра"
                    className="h-8 text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium">Период</label>
                  <Select
                    value={filterForm.period}
                    onValueChange={(v) => setFilterForm({ ...filterForm, period: v })}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {periods.map((p) => (
                        <SelectItem key={p.value} value={p.value} className="text-xs">
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium">Категории</label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((cat) => (
                      <label key={cat} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filterForm.selectedCategories.includes(cat)}
                          onChange={(e) =>
                            setFilterForm({
                              ...filterForm,
                              selectedCategories: toggleArrayValue(filterForm.selectedCategories, cat),
                            })
                          }
                          className="w-4 h-4"
                        />
                        <span className="text-xs">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium">Регионы</label>
                  <div className="grid grid-cols-2 gap-2">
                    {regions.map((region) => (
                      <label key={region} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filterForm.selectedRegions.includes(region)}
                          onChange={(e) =>
                            setFilterForm({
                              ...filterForm,
                              selectedRegions: toggleArrayValue(filterForm.selectedRegions, region),
                            })
                          }
                          className="w-4 h-4"
                        />
                        <span className="text-xs">{region}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium">Типы клиентов</label>
                  <div className="flex gap-2">
                    {clientTypes.map((type) => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filterForm.selectedClientTypes.includes(type)}
                          onChange={(e) =>
                            setFilterForm({
                              ...filterForm,
                              selectedClientTypes: toggleArrayValue(filterForm.selectedClientTypes, type),
                            })
                          }
                          className="w-4 h-4"
                        />
                        <span className="text-xs">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={filterForm.isPublic}
                    onChange={(e) => setFilterForm({ ...filterForm, isPublic: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="isPublic" className="text-xs cursor-pointer">
                    Доступен всем пользователям
                  </label>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSaveFilter} className="flex-1 text-xs">
                    {editingFilter ? 'Обновить' : 'Создать'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={resetFilterForm}
                    className="flex-1 text-xs"
                  >
                    Отмена
                  </Button>
                </div>
              </div>
            )}

            {/* Список фильтров */}
            <div className="space-y-2">
              {filterPresets.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">Нет предустановленных фильтров</p>
              ) : (
                filterPresets.map((preset) => (
                  <div
                    key={preset.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3 gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Filter className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm font-medium truncate">{preset.name}</span>
                        {preset.isPublic && (
                          <Badge variant="outline" className="text-xs flex-shrink-0">
                            Публичный
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 ml-5.5">
                        {preset.description || 'Без описания'}
                      </p>
                      <div className="text-xs text-muted-foreground mt-1 ml-5.5 flex flex-wrap gap-1">
                        {preset.filters.categories.length > 0 && (
                          <span>Категории: {preset.filters.categories.join(', ')}</span>
                        )}
                        {preset.filters.regions.length > 0 && (
                          <span>Регионы: {preset.filters.regions.join(', ')}</span>
                        )}
                        {preset.filters.clientTypes.length > 0 && (
                          <span>Клиенты: {preset.filters.clientTypes.join(', ')}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs h-8 px-2"
                        onClick={() => handleEditFilter(preset)}
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs h-8 px-2 text-destructive"
                        onClick={() => handleDeleteFilter(preset.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Настройки видимости */}
      <TabsContent value="settings" className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Настройки видимости
            </CardTitle>
            <CardDescription className="text-xs">
              Управляйте видимостью компонентов для разных ролей
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Карточки продуктов</p>
                  <p className="text-xs text-muted-foreground">Показывать карточки для менеджеров</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">График выручки</p>
                  <p className="text-xs text-muted-foreground">Показывать менеджерам</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Кросс-продажи</p>
                  <p className="text-xs text-muted-foreground">Показывать только в рамках доступа</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Экспорт данных</p>
                  <p className="text-xs text-muted-foreground">Разрешить менеджерам экспортировать</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
            </div>
            <Button className="w-full text-xs" onClick={() => toast.success('Настройки сохранены')}>
              Сохранить настройки
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* CRM и источники данных */}
      <TabsContent value="crm" className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Database className="w-4 h-4" />
              Источники данных
            </CardTitle>
            <CardDescription className="text-xs">
              Управление подключением к CRM и расписанием обновлений
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border p-4 space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">CRM система</label>
                <Select defaultValue="mock">
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mock" className="text-xs">Mock данные (текущие)</SelectItem>
                    <SelectItem value="salesforce" className="text-xs">Salesforce</SelectItem>
                    <SelectItem value="pipedrive" className="text-xs">Pipedrive</SelectItem>
                    <SelectItem value="hubspot" className="text-xs">HubSpot</SelectItem>
                    <SelectItem value="custom" className="text-xs">Кастомный API</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Частота обновления</label>
                <Select defaultValue="manual">
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual" className="text-xs">Вручную (по кнопке)</SelectItem>
                    <SelectItem value="5min" className="text-xs">Каждые 5 минут</SelectItem>
                    <SelectItem value="15min" className="text-xs">Каждые 15 минут</SelectItem>
                    <SelectItem value="hour" className="text-xs">Каждый час</SelectItem>
                    <SelectItem value="daily" className="text-xs">Каждый день</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Статус подключения</label>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-xs text-muted-foreground">Используются Mock данные</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 text-xs" onClick={() => toast.success('Обновление данных запущено')}>
                <Download className="w-3 h-3 mr-1" />
                Обновить сейчас
              </Button>
              <Button variant="outline" className="flex-1 text-xs" onClick={() => toast.success('Параметры сохранены')}>
                Сохранить
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
