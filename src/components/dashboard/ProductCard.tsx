import { type Product, formatCurrency, formatNumber } from '@/data/mockData';

interface ProductCardProps {
  product: Product;
  totalRevenue: number;
  onClick: (product: Product) => void;
}

export function ProductCard({ product, totalRevenue, onClick }: ProductCardProps) {
  const revenuePercent = ((product.revenue / totalRevenue) * 100).toFixed(1);

  return (
    <div
      className="group rounded-lg border border-border bg-card p-4 card-hover cursor-pointer relative overflow-hidden"
      onClick={() => onClick(product)}
    >
      <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-primary/10 text-primary text-xs font-mono font-semibold px-2 py-1 rounded-bl-lg">
        {revenuePercent}% выручки
      </div>

      <div className="mb-3">
        <h3 className="font-semibold text-foreground text-sm">{product.name}</h3>
        <span className="text-xs text-muted-foreground">{product.category}</span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-baseline">
          <span className="text-xs text-muted-foreground">Выручка</span>
          <span className="font-mono text-sm font-semibold text-foreground">{formatCurrency(product.revenue)}</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-xs text-muted-foreground">Сделки</span>
          <span className="font-mono text-sm font-medium text-foreground">{formatNumber(product.deals)}</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-xs text-muted-foreground">Средний чек</span>
          <span className="font-mono text-sm font-medium text-accent">{formatCurrency(product.avgCheck)}</span>
        </div>
      </div>

      <div className="mt-3 h-1 w-full rounded-full bg-secondary overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${revenuePercent}%` }}
        />
      </div>
    </div>
  );
}
