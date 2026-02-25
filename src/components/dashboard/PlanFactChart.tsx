import { monthlyPlanFact } from '@/data/mockData';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell, ReferenceLine
} from 'recharts';
import { Target, TrendingUp } from 'lucide-react';

interface TooltipPayloadItem { dataKey: string; value: number; }
interface ChartTooltipProps  { active?: boolean; payload?: TooltipPayloadItem[]; label?: string; }

const CustomTooltip = ({ active, payload, label }: ChartTooltipProps) => {
  if (!active || !payload?.length) return null;
  const plan = payload.find((p) => p.dataKey === 'plan')?.value ?? 0;
  const fact = payload.find((p) => p.dataKey === 'fact')?.value ?? 0;
  const pct  = plan > 0 ? ((fact / plan) * 100).toFixed(1) : '—';
  const ok   = Number(pct) >= 100;
  return (
    <div className="bg-card border border-border rounded-xl p-3 text-xs shadow-xl space-y-1.5 min-w-[160px]">
      <p className="font-bold text-foreground text-sm mb-2">{label}</p>
      <div className="flex justify-between gap-4">
        <span className="text-muted-foreground">План</span>
        <span className="font-mono font-semibold text-foreground">{(plan / 1_000_000).toFixed(2)}M</span>
      </div>
      <div className="flex justify-between gap-4">
        <span className="text-muted-foreground">Факт</span>
        <span className="font-mono font-semibold text-foreground">{(fact / 1_000_000).toFixed(2)}M</span>
      </div>
      <div className={`flex justify-between gap-4 pt-1 border-t border-border font-bold ${ok ? 'text-emerald-500' : 'text-amber-500'}`}>
        <span>Выполнение</span>
        <span className="font-mono">{pct}%</span>
      </div>
    </div>
  );
};

export function PlanFactChart() {
  const totalPlan = monthlyPlanFact.reduce((s, m) => s + m.plan, 0);
  const totalFact = monthlyPlanFact.reduce((s, m) => s + m.fact, 0);
  const overall   = ((totalFact / totalPlan) * 100).toFixed(1);
  const isOk      = Number(overall) >= 100;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Target className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">План vs Факт</h3>
            <p className="text-[11px] text-muted-foreground">Выручка по месяцам</p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold
          ${isOk ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
          <TrendingUp className="w-3.5 h-3.5" />
          <span className="font-mono">{overall}%</span>
          <span className="font-normal opacity-70">за год</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={monthlyPlanFact} barCategoryGap="35%" barGap={3}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`}
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted)/0.4)', radius: 6 }} />
          <Bar dataKey="plan" name="plan" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} maxBarSize={20} />
          <Bar dataKey="fact" name="fact" radius={[4, 4, 0, 0]} maxBarSize={20}>
            {monthlyPlanFact.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.fact >= entry.plan ? 'hsl(160,65%,45%)' : 'hsl(221,83%,58%)'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Легенда */}
      <div className="flex items-center gap-5 justify-center mt-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-muted inline-block" />План
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-primary inline-block" />Факт (выполнено)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />Факт (перевыполнено)
        </span>
      </div>
    </div>
  );
}
