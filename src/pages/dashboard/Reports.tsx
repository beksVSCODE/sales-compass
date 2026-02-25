import { PlanFactChart } from '@/components/dashboard/PlanFactChart';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { kpiData, calcChange, monthlyPlanFact } from '@/data/mockData';
import { TrendingUp, Receipt, Percent, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend, Line, LineChart, Cell
} from 'recharts';

export default function Reports() {
  const navigate = useNavigate();

  const totalPlan = monthlyPlanFact.reduce((s, m) => s + m.plan, 0);
  const totalFact = monthlyPlanFact.reduce((s, m) => s + m.fact, 0);
  const overallPct = ((totalFact / totalPlan) * 100).toFixed(1);

  const lineData = monthlyPlanFact.map((m) => ({
    month: m.month,
    план: m.plan,
    факт: m.fact,
  }));

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50 sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="h-8 text-xs">
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />Дашборд
          </Button>
          <div>
            <h1 className="text-base font-bold text-foreground">Финансовые отчёты</h1>
            <p className="text-[11px] text-muted-foreground">План, факт и динамика выручки по месяцам</p>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">
        {/* KPI отчётов */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <KpiCard
            label="Годовой план"
            value={`${(totalPlan / 1_000_000).toFixed(1)}M`}
            unit="KGS"
            change={0}
            icon={Target}
            iconColor="text-muted-foreground"
          />
          <KpiCard
            label="Годовой факт"
            value={`${(totalFact / 1_000_000).toFixed(1)}M`}
            unit="KGS"
            change={calcChange(kpiData.totalRevenue.current, kpiData.totalRevenue.previous)}
            icon={TrendingUp}
            iconColor="text-primary"
          />
          <KpiCard
            label="Выполнение плана"
            value={overallPct}
            unit="%"
            change={0}
            icon={Percent}
            iconColor={Number(overallPct) >= 100 ? 'text-emerald-500' : 'text-amber-500'}
          />
          <KpiCard
            label="Средний чек"
            value={`${(kpiData.avgCheck.current / 1000).toFixed(0)}K`}
            unit="KGS"
            change={calcChange(kpiData.avgCheck.current, kpiData.avgCheck.previous)}
            icon={Receipt}
            iconColor="text-chart-3"
          />
        </div>

        {/* Таблица выполнения плана */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Выполнение плана по месяцам</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground font-medium">Месяц</th>
                  <th className="text-right py-2 text-muted-foreground font-medium">План</th>
                  <th className="text-right py-2 text-muted-foreground font-medium">Факт</th>
                  <th className="text-right py-2 text-muted-foreground font-medium">Δ (KGS)</th>
                  <th className="text-right py-2 text-muted-foreground font-medium">Выполнение</th>
                </tr>
              </thead>
              <tbody>
                {monthlyPlanFact.map((m) => {
                  const delta = m.fact - m.plan;
                  const pct = m.fulfillment;
                  return (
                    <tr key={m.month} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="py-2 font-medium text-foreground">{m.month}</td>
                      <td className="py-2 text-right text-muted-foreground font-mono">{(m.plan / 1_000_000).toFixed(2)}M</td>
                      <td className="py-2 text-right text-foreground font-mono font-semibold">{(m.fact / 1_000_000).toFixed(2)}M</td>
                      <td className={`py-2 text-right font-mono font-medium ${delta >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {delta >= 0 ? '+' : ''}{(delta / 1000).toFixed(0)}K
                      </td>
                      <td className="py-2 text-right">
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          pct >= 105 ? 'bg-emerald-500/10 text-emerald-600' :
                          pct >= 95  ? 'bg-blue-500/10 text-blue-600' :
                          pct >= 85  ? 'bg-amber-500/10 text-amber-600' :
                          'bg-red-500/10 text-red-600'
                        }`}>
                          {pct.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-border">
                  <td className="py-2 font-semibold text-foreground">Итого</td>
                  <td className="py-2 text-right font-mono font-semibold text-foreground">{(totalPlan / 1_000_000).toFixed(2)}M</td>
                  <td className="py-2 text-right font-mono font-semibold text-foreground">{(totalFact / 1_000_000).toFixed(2)}M</td>
                  <td className={`py-2 text-right font-mono font-semibold ${totalFact >= totalPlan ? 'text-emerald-500' : 'text-red-500'}`}>
                    {totalFact >= totalPlan ? '+' : ''}{((totalFact - totalPlan) / 1_000_000).toFixed(2)}M
                  </td>
                  <td className="py-2 text-right">
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${Number(overallPct) >= 100 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                      {overallPct}%
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Графики */}
        <PlanFactChart />

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Динамика выручки (линейный тренд)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(220,9%,46%)' }} />
              <YAxis tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`} tick={{ fontSize: 11, fill: 'hsl(220,9%,46%)' }} />
              <Tooltip
                formatter={(v: number, name: string) => [`${(v / 1_000_000).toFixed(2)}M KGS`, name]}
                contentStyle={{ borderRadius: 8, border: '1px solid hsl(220,13%,91%)', fontSize: 12 }}
              />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="план" stroke="hsl(220,13%,70%)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="факт" stroke="hsl(217,91%,60%)" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
