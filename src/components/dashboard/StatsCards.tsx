import { type Product, formatCurrency, formatNumber } from '@/data/mockData';
import { TrendingUp, ShoppingCart, Receipt, BarChart3 } from 'lucide-react';

interface StatsCardsProps {
  products: Product[];
}

export function StatsCards({ products }: StatsCardsProps) {
  const totalRevenue = products.reduce((s, p) => s + p.revenue, 0);
  const totalDeals = products.reduce((s, p) => s + p.deals, 0);
  const avgCheck = totalDeals > 0 ? totalRevenue / totalDeals : 0;

  const stats = [
    { label: 'Общая выручка', value: formatCurrency(totalRevenue), icon: TrendingUp, color: 'text-primary' },
    { label: 'Всего сделок', value: formatNumber(totalDeals), icon: ShoppingCart, color: 'text-accent' },
    { label: 'Средний чек', value: formatCurrency(avgCheck), icon: Receipt, color: 'text-chart-3' },
    { label: 'Продуктов', value: formatNumber(products.length), icon: BarChart3, color: 'text-chart-4' },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
            <stat.icon className={`w-4 h-4 ${stat.color}`} />
          </div>
          <p className="font-mono text-xl font-semibold text-foreground">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
