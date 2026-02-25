import { type Product, formatCurrency, formatNumber } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  totalRevenue: number;
  onClick: (product: Product) => void;
}

const typeColors: Record<string, { bg: string; text: string }> = {
  B2B: { bg: 'bg-primary/10',     text: 'text-primary'     },
  B2C: { bg: 'bg-emerald-500/10', text: 'text-emerald-600' },
  VIP: { bg: 'bg-amber-500/10',   text: 'text-amber-600'   },
};

export function ProductCard({ product, totalRevenue, onClick }: ProductCardProps) {
  const revenuePercent = ((product.revenue / totalRevenue) * 100).toFixed(1);
  const type = typeColors[product.clientType] ?? typeColors.B2B;

  return (
    <div
      className="group relative rounded-xl border border-border bg-card overflow-hidden cursor-pointer transition-all duration-200 hover:border-primary/40 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 fade-in"
      onClick={() => onClick(product)}
    >
      {/* Верхний прогресс-индикатор выручки */}
      <div className="h-1 bg-muted/60">
        <div
          className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-700"
          style={{ width: `${revenuePercent}%` }}
        />
      </div>

      <div className="p-4">
        {/* Заголовок */}
        <div className="flex items-start justify-between mb-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-foreground text-sm leading-tight truncate">{product.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{product.category} · {product.region}</p>
          </div>
          <div className="flex items-center gap-1.5 ml-2 shrink-0">
            <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full', type.bg, type.text)}>
              {product.clientType}
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Метрики */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Выручка</span>
            <span className="font-mono text-sm font-bold text-foreground">{formatCurrency(product.revenue)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Сделки</span>
            <span className="font-mono text-sm font-semibold text-foreground">{formatNumber(product.deals)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Средний чек</span>
            <span className="font-mono text-sm font-semibold text-violet-500">{formatCurrency(product.avgCheck)}</span>
          </div>
        </div>

        {/* Доля выручки */}
        <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground">Доля выручки</span>
          <span className="text-[11px] font-bold text-primary font-mono">{revenuePercent}%</span>
        </div>
      </div>
    </div>
  );
}
