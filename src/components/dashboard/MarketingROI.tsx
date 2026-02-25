import { marketingChannels } from '@/data/mockData';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell
} from 'recharts';
import { Megaphone } from 'lucide-react';
import { cn } from '@/lib/utils';

const roiTier = (roi: number) => {
  if (roi >= 1000) return { color: 'text-emerald-500', bg: 'bg-emerald-500/10', bar: 'hsl(160,65%,45%)', label: 'Топ' };
  if (roi >= 300)  return { color: 'text-primary',     bg: 'bg-primary/10',     bar: 'hsl(221,83%,58%)', label: 'Хор.' };
  if (roi >= 100)  return { color: 'text-amber-500',   bg: 'bg-amber-500/10',   bar: 'hsl(35,95%,55%)',  label: 'Сред.' };
  return               { color: 'text-red-500',     bg: 'bg-red-500/10',     bar: 'hsl(0,72%,55%)',   label: 'Низк.' };
};

interface ChartTooltipProps { active?: boolean; payload?: Array<{ value: number }>; label?: string; }

const CustomTooltip = ({ active, payload, label }: ChartTooltipProps) => {
  if (!active || !payload?.length) return null;
  const ch = marketingChannels.find((c) => c.channel === label);
  if (!ch) return null;
  const tier = roiTier(ch.roi);
  return (
    <div className="bg-card border border-border rounded-xl p-3 text-xs shadow-xl space-y-1.5 min-w-[170px]">
      <p className="font-bold text-foreground text-sm">{ch.channel}</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        <span className="text-muted-foreground">Лиды</span>       <span className="font-semibold text-right">{ch.leads}</span>
        <span className="text-muted-foreground">Расходы</span>    <span className="font-mono font-semibold text-right">{(ch.spend/1000).toFixed(0)}K</span>
        <span className="text-muted-foreground">Выручка</span>    <span className="font-mono font-semibold text-right">{(ch.revenue/1_000_000).toFixed(2)}M</span>
        <span className="text-muted-foreground">Конверсия</span>  <span className="font-semibold text-right">{ch.conversion}%</span>
      </div>
      <div className={cn('flex justify-between items-center pt-1 border-t border-border font-bold', tier.color)}>
        <span>ROI</span>
        <span className="font-mono">{ch.roi}%</span>
      </div>
    </div>
  );
};

export function MarketingROI() {
  const totalLeads   = marketingChannels.reduce((s, c) => s + c.leads, 0);
  const totalSpend   = marketingChannels.reduce((s, c) => s + c.spend, 0);
  const totalRevenue = marketingChannels.reduce((s, c) => s + c.revenue, 0);
  const avgROI       = ((totalRevenue - totalSpend) / totalSpend * 100).toFixed(0);
  const sorted       = [...marketingChannels].sort((a, b) => b.roi - a.roi);

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-5">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Megaphone className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">ROI по каналам</h3>
            <p className="text-[11px] text-muted-foreground">Маркетинговая эффективность</p>
          </div>
        </div>
        <div className="flex gap-3 text-xs">
          <div className="text-center">
            <p className="font-mono font-bold text-foreground">{totalLeads}</p>
            <p className="text-muted-foreground text-[10px]">лидов</p>
          </div>
          <div className="w-px bg-border" />
          <div className="text-center">
            <p className="font-mono font-bold text-foreground">{(totalSpend/1_000_000).toFixed(2)}M</p>
            <p className="text-muted-foreground text-[10px]">расходы</p>
          </div>
          <div className="w-px bg-border" />
          <div className="text-center">
            <p className={cn('font-mono font-bold', roiTier(Number(avgROI)).color)}>{avgROI}%</p>
            <p className="text-muted-foreground text-[10px]">сред. ROI</p>
          </div>
        </div>
      </div>

      {/* График */}
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={sorted} margin={{ left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="channel"
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={false} tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted)/0.4)', radius: 6 }} />
          <Bar dataKey="roi" radius={[6, 6, 0, 0]} maxBarSize={32}>
            {sorted.map((ch, i) => (
              <Cell key={i} fill={roiTier(ch.roi).bar} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Таблица */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-separate border-spacing-0">
          <thead>
            <tr>
              {['Канал', 'Лиды', 'Цена лида', 'Расходы', 'Выручка', 'Конв.', 'ROI'].map((h, i) => (
                <th key={h} className={cn(
                  'py-2 text-muted-foreground font-semibold border-b border-border',
                  i === 0 ? 'text-left' : 'text-right'
                )}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((ch, i) => {
              const tier = roiTier(ch.roi);
              return (
                <tr
                  key={ch.channel}
                  className="group hover:bg-muted/30 transition-colors"
                >
                  <td className="py-2 font-semibold text-foreground">
                    <span className={cn('mr-1.5 text-[10px] px-1 py-0.5 rounded font-bold', tier.bg, tier.color)}>
                      {tier.label}
                    </span>
                    {ch.channel}
                  </td>
                  <td className="py-2 text-right text-muted-foreground">{ch.leads}</td>
                  <td className="py-2 text-right text-muted-foreground font-mono">{ch.costPerLead.toLocaleString('ru-RU')}</td>
                  <td className="py-2 text-right text-muted-foreground font-mono">{(ch.spend/1000).toFixed(0)}K</td>
                  <td className="py-2 text-right text-muted-foreground font-mono">{(ch.revenue/1_000_000).toFixed(2)}M</td>
                  <td className="py-2 text-right text-muted-foreground">{ch.conversion}%</td>
                  <td className="py-2 text-right">
                    <span className={cn('px-2 py-0.5 rounded-full font-bold font-mono', tier.bg, tier.color)}>
                      {ch.roi}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

