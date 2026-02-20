import { useState } from 'react';
import { periods, categories, regions, clientTypes, type Filters } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RotateCw, X, Bookmark } from 'lucide-react';
import { FilterPresetsManager } from '@/lib/filterPresets';

interface FilterPanelProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onRefresh: () => void;
}

export function FilterPanel({ filters, onFiltersChange, onRefresh }: FilterPanelProps) {
  const [presets] = useState(FilterPresetsManager.getPublic());

  const toggleArrayItem = (arr: string[], item: string) =>
    arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];

  const resetFilters = () => {
    onFiltersChange({ period: 'month', categories: [], regions: [], clientTypes: [] });
  };

  const applyPreset = (presetId: string) => {
    const preset = FilterPresetsManager.getById(presetId);
    if (preset) {
      onFiltersChange(preset.filters);
    }
  };

  const hasActiveFilters = filters.categories.length > 0 || filters.regions.length > 0 || filters.clientTypes.length > 0 || filters.period !== 'month';

  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground uppercase tracking-wider">Фильтры</h2>
        <div className="flex gap-2">
          {presets.length > 0 && (
            <Select onValueChange={applyPreset}>
              <SelectTrigger className="w-[280px] h-11 text-sm font-medium">
                <Bookmark className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Применить предустановку" />
              </SelectTrigger>
              <SelectContent>
                {presets.map((preset) => (
                  <SelectItem key={preset.id} value={preset.id} className="text-sm">
                    {preset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

        <div>
          <label className="text-sm font-semibold text-muted-foreground mb-3 block">Категория</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <Badge
                key={c}
                variant={filters.categories.includes(c) ? 'default' : 'outline'}
                className="cursor-pointer text-sm px-4 py-2 font-semibold hover:shadow-md transition-shadow"
                onClick={() => onFiltersChange({ ...filters, categories: toggleArrayItem(filters.categories, c) })}
              >
                {c}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-8">
          <div>
            <label className="text-sm font-semibold text-muted-foreground mb-3 block">Регион</label>
            <div className="flex flex-wrap gap-2">
              {regions.map((r) => (
                <Badge
                  key={r}
                  variant={filters.regions.includes(r) ? 'default' : 'outline'}
                  className="cursor-pointer text-sm px-4 py-2 font-semibold hover:shadow-md transition-shadow"
                  onClick={() => onFiltersChange({ ...filters, regions: toggleArrayItem(filters.regions, r) })}
                >
                  {r}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-muted-foreground mb-3 block">Тип клиента</label>
            <div className="flex gap-2">
              {clientTypes.map((ct) => (
                <Badge
                  key={ct}
                  variant={filters.clientTypes.includes(ct) ? 'default' : 'outline'}
                  className="cursor-pointer text-sm px-4 py-2 font-semibold hover:shadow-md transition-shadow"
                  onClick={() => onFiltersChange({ ...filters, clientTypes: toggleArrayItem(filters.clientTypes, ct) })}
                >
                  {ct}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
