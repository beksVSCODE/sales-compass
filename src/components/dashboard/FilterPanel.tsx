import { periods, categories, regions, clientTypes, type Filters } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCw, X } from 'lucide-react';

interface FilterPanelProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onRefresh: () => void;
}

export function FilterPanel({ filters, onFiltersChange, onRefresh }: FilterPanelProps) {
  const toggleArrayItem = (arr: string[], item: string) =>
    arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];

  const resetFilters = () => {
    onFiltersChange({ period: 'month', categories: [], regions: [], clientTypes: [] });
  };

  const hasActiveFilters = filters.categories.length > 0 || filters.regions.length > 0 || filters.clientTypes.length > 0 || filters.period !== 'month';

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Фильтры</h2>
        <div className="flex gap-2">
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4 mr-1" /> Сбросить
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RotateCw className="w-4 h-4 mr-1" /> Обновить
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Период</label>
          <div className="flex gap-1">
            {periods.map((p) => (
              <button
                key={p.value}
                onClick={() => onFiltersChange({ ...filters, period: p.value })}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  filters.period === p.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Категория</label>
          <div className="flex flex-wrap gap-1">
            {categories.map((c) => (
              <Badge
                key={c}
                variant={filters.categories.includes(c) ? 'default' : 'outline'}
                className="cursor-pointer text-xs"
                onClick={() => onFiltersChange({ ...filters, categories: toggleArrayItem(filters.categories, c) })}
              >
                {c}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-6">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Регион</label>
            <div className="flex flex-wrap gap-1">
              {regions.map((r) => (
                <Badge
                  key={r}
                  variant={filters.regions.includes(r) ? 'default' : 'outline'}
                  className="cursor-pointer text-xs"
                  onClick={() => onFiltersChange({ ...filters, regions: toggleArrayItem(filters.regions, r) })}
                >
                  {r}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Тип клиента</label>
            <div className="flex gap-1">
              {clientTypes.map((ct) => (
                <Badge
                  key={ct}
                  variant={filters.clientTypes.includes(ct) ? 'default' : 'outline'}
                  className="cursor-pointer text-xs"
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
