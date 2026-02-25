import { type Product, formatCurrency, formatNumber } from '@/data/mockData';
import { TrendingUp, ShoppingCart, Receipt, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardsProps {
  products: Product[];
}

const configs = [
  { label: 'Общая выручка', icon: TrendingUp,   accent: 'bg-primary',     iconColor: 'text-primary',     key: 'revenue' as const },
  { label: 'Всего сделок',  icon: ShoppingCart, accent: 'bg-emerald-500', iconColor: 'text-emerald-500', key: 'deals'   as const },
  { label: 'Средний чек',   icon: Receipt,      accent: 'bg-violet-500',  iconColor: 'text-violet-500',  key: 'avg'     as const },
  { label: 'Продуктов',     icon: BarChart3,    accent: 'bg-amber-500',   iconColor: 'text-amber-500',   key: 'count'   as const },
];

export function StatsCards({ products }: StatsCardsProps) {
  const totalRevenue = products.reduce((s, p) => s + p.revenue, 0);
  const totalDeals   = products.reduce((s, p) => s + p.deals, 0);
  const avgCheck     = totalDeals > 0 ? totalRevenue / totalDeals : 0;

  const values: Record<string, string> = {
    revenue: formatCurrency(totalRevenue),
    deals:   formatNumber(totalDeals),
    avg:     formatCurrency(avgCheck),
    count:   formatNumber(products.length),
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {configs.map((cfg) => (
        <div
          key={cfg.label}
          className="relative rounded-xl border border-border bg-card overflow-hidden transition-all duration-200 hover:shadow-md hover:shadow-black/5 hover:-translate-y-0.5 fade-in"
        >
          <div className={cn('absolute left-0 top-0 bottom-0 w-1 rounded-l-xl', cfg.accent)} />
          <div className="pl-5 pr-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">{cfg.label}</span>
              <div className={cn('p-1.5 rounded-lg bg-muted/50')}>
                <cfg.icon className={cn('w-4 h-4', cfg.iconColor)} />
              </div>
            </div>
            <p className="font-mono text-base font-bold text-foreground tracking-tight truncate">{values[cfg.key]}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
