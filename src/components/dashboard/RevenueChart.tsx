import { type Product, formatCurrency } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

interface RevenueChartProps {
  products: Product[];
}

export function RevenueChart({ products }: RevenueChartProps) {
  const data = [...products]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8)
    .map((p) => ({ name: p.name, revenue: p.revenue }));

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-sm font-semibold text-foreground mb-4">Топ продуктов по выручке</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11, fill: 'hsl(220, 9%, 46%)' }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'hsl(220, 9%, 46%)' }} width={110} />
          <Tooltip
            formatter={(value: number) => [formatCurrency(value), 'Выручка']}
            contentStyle={{ borderRadius: 8, border: '1px solid hsl(220, 13%, 91%)', fontSize: 12 }}
          />
          <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={i === 0 ? 'hsl(217, 91%, 60%)' : i === 1 ? 'hsl(217, 91%, 70%)' : 'hsl(217, 91%, 80%)'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
