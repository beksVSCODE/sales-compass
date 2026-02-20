import { type Product, formatNumber } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

interface DealsChartProps {
  products: Product[];
}

export function DealsChart({ products }: DealsChartProps) {
  const data = [...products]
    .sort((a, b) => b.deals - a.deals)
    .slice(0, 8)
    .map((p) => ({ name: p.name, deals: p.deals }));

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-sm font-semibold text-foreground mb-4">Топ продуктов по количеству сделок</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11, fill: 'hsl(220, 9%, 46%)' }} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'hsl(220, 9%, 46%)' }} width={110} />
          <Tooltip
            formatter={(value: number) => [formatNumber(value), 'Сделки']}
            contentStyle={{ borderRadius: 8, border: '1px solid hsl(220, 13%, 91%)', fontSize: 12 }}
          />
          <Bar dataKey="deals" radius={[0, 4, 4, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={i === 0 ? 'hsl(173, 58%, 39%)' : i === 1 ? 'hsl(173, 58%, 52%)' : 'hsl(173, 58%, 65%)'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
