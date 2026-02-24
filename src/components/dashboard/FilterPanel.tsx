import { useEffect, useMemo, useState } from 'react';
import { periods, categories, regions, clientTypes, type Filters } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RotateCw, X, Bookmark } from 'lucide-react';
import { FilterPresetsManager } from '@/lib/filterPresets';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface FilterPanelProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onRefresh: () => void;
}

export function FilterPanel({ filters, onFiltersChange, onRefresh }: FilterPanelProps) {
  const { profile, user, isAdmin } = useAuth();
  const userEmail = useMemo(() => profile?.email || user?.email || null, [profile?.email, user?.email]);
  const [presets, setPresets] = useState(FilterPresetsManager.getForUser(userEmail));
  const [presetName, setPresetName] = useState('');
  const [deletePresetId, setDeletePresetId] = useState<string>('');

  useEffect(() => {
    setPresets(FilterPresetsManager.getForUser(userEmail));
    setDeletePresetId('');
  }, [userEmail]);

  const resetFilters = () => {
    onFiltersChange({
      period: 'month',
      categories: [],
      regions: [],
      clientTypes: [],
      dateRange: { startDate: null, endDate: null },
    });
  };

  const applyPreset = (presetId: string) => {
    const preset = FilterPresetsManager.getById(presetId);
    if (preset) {
      onFiltersChange({
        ...filters,
        ...preset.filters,
        dateRange: preset.filters.dateRange ?? filters.dateRange,
      });
    }
  };

  const handleSavePreset = () => {
    if (!userEmail) {
      toast.error('Не удалось определить пользователя');
      return;
    }
    const name = presetName.trim();
    if (!name) {
      toast.error('Введите название шаблона');
      return;
    }

    FilterPresetsManager.create(
      name,
      {
        period: filters.period,
        categories: filters.categories,
        regions: filters.regions,
        clientTypes: filters.clientTypes,
        dateRange: filters.dateRange,
      },
      userEmail,
      undefined,
      isAdmin
    );

    setPresetName('');
    setPresets(FilterPresetsManager.getForUser(userEmail));
    toast.success('Шаблон фильтра сохранен');
  };

  const handleDeletePreset = () => {
    if (!deletePresetId) {
      toast.error('Выберите шаблон для удаления');
      return;
    }
    const preset = FilterPresetsManager.getById(deletePresetId);
    if (!preset) {
      toast.error('Шаблон не найден');
      return;
    }
    if (!isAdmin && preset.createdBy !== userEmail) {
      toast.error('Можно удалять только свои шаблоны');
      return;
    }
    if (FilterPresetsManager.delete(deletePresetId)) {
      setPresets(FilterPresetsManager.getForUser(userEmail));
      setDeletePresetId('');
      toast.success('Шаблон удален');
      return;
    }
    toast.error('Не удалось удалить шаблон');
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.regions.length > 0 ||
    filters.clientTypes.length > 0 ||
    filters.period !== 'month' ||
    !!filters.dateRange.startDate ||
    !!filters.dateRange.endDate;

  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground uppercase tracking-wider">Фильтры</h2>
        <div className="flex gap-2">
          {presets.length > 0 && (
            <div className="flex items-center gap-2">
              <Select onValueChange={applyPreset}>
                <SelectTrigger className="w-[280px] h-11 text-sm font-medium">
                  <Bookmark className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Применить шаблон" />
                </SelectTrigger>
                <SelectContent>
                  {presets.map((preset) => (
                    <SelectItem key={preset.id} value={preset.id} className="text-sm">
                      {preset.createdBy === userEmail ? `Мой: ${preset.name}` : preset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={deletePresetId} onValueChange={setDeletePresetId}>
                <SelectTrigger className="w-[220px] h-11 text-sm font-medium">
                  <SelectValue placeholder="Удалить шаблон" />
                </SelectTrigger>
                <SelectContent>
                  {presets
                    .filter((preset) => isAdmin || preset.createdBy === userEmail)
                    .map((preset) => (
                      <SelectItem key={preset.id} value={preset.id} className="text-sm">
                        {preset.createdBy === userEmail ? `Мой: ${preset.name}` : preset.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="lg" onClick={handleDeletePreset} className="h-11 font-semibold">
                Удалить
              </Button>
            </div>
          )}
          {hasActiveFilters && (
            <Button variant="ghost" size="lg" onClick={resetFilters} className="text-muted-foreground hover:text-foreground h-11 font-semibold">
              <X className="w-5 h-5 mr-2" /> Сбросить
            </Button>
          )}
          <Button variant="outline" size="lg" onClick={onRefresh} className="h-11 font-semibold">
            <RotateCw className="w-5 h-5 mr-2" /> Обновить
          </Button>
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-lg border border-border bg-secondary/20 p-4">
          <div className="flex items-center gap-3">
            <Input
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              placeholder="Название шаблона"
              className="h-11"
            />
            <Button size="lg" onClick={handleSavePreset} className="h-11 font-semibold">
              Сохранить шаблон
            </Button>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-muted-foreground mb-3 block">Период</label>
          <div className="flex gap-2">
            {periods.map((p) => (
              <button
                key={p.value}
                onClick={() => onFiltersChange({ ...filters, period: p.value })}
                className={`px-5 py-3 rounded-md text-sm font-bold transition-colors ${
                  filters.period === p.value
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="text-sm font-semibold text-muted-foreground mb-3 block">Категория</label>
            <Select
              value={filters.categories[0] ?? 'all'}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  categories: value === 'all' ? [] : [value],
                })
              }
            >
              <SelectTrigger className="h-11 text-sm font-medium">
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-sm">Все категории</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c} className="text-sm">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-semibold text-muted-foreground mb-3 block">Регион</label>
            <Select
              value={filters.regions[0] ?? 'all'}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  regions: value === 'all' ? [] : [value],
                })
              }
            >
              <SelectTrigger className="h-11 text-sm font-medium">
                <SelectValue placeholder="Выберите регион" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-sm">Все регионы</SelectItem>
                {regions.map((r) => (
                  <SelectItem key={r} value={r} className="text-sm">
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-semibold text-muted-foreground mb-3 block">Тип клиента</label>
            <Select
              value={filters.clientTypes[0] ?? 'all'}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  clientTypes: value === 'all' ? [] : [value as Filters['clientTypes'][number]],
                })
              }
            >
              <SelectTrigger className="h-11 text-sm font-medium">
                <SelectValue placeholder="Выберите тип" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-sm">Все типы</SelectItem>
                {clientTypes.map((ct) => (
                  <SelectItem key={ct} value={ct} className="text-sm">
                    {ct}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-muted-foreground mb-3 block">Период отчетности</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-muted-foreground block mb-2">С</span>
              <Input
                type="date"
                value={filters.dateRange.startDate ?? ''}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    dateRange: { ...filters.dateRange, startDate: e.target.value || null },
                  })
                }
              />
            </div>
            <div>
              <span className="text-xs text-muted-foreground block mb-2">По</span>
              <Input
                type="date"
                value={filters.dateRange.endDate ?? ''}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    dateRange: { ...filters.dateRange, endDate: e.target.value || null },
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
