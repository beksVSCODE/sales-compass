import { managers } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

// Примерные данные зарплат (mock)
const salaryData = managers.map((m, i) => ({
  ...m,
  baseSalary:  60_000 + i * 5_000,
  bonusPct:    Math.round((m.revenue / 3_000_000) * 15),     // % бонуса от плана
  bonusAmount: Math.round((m.revenue / 3_000_000) * 15 * (60_000 + i * 5_000) / 100),
}));

export default function Salaries() {
  const navigate = useNavigate();

  const totalBase   = salaryData.reduce((s, m) => s + m.baseSalary, 0);
  const totalBonus  = salaryData.reduce((s, m) => s + m.bonusAmount, 0);
  const totalPayout = totalBase + totalBonus;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50 sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="h-8 text-xs">
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />Дашборд
          </Button>
          <div>
            <h1 className="text-base font-bold text-foreground">Зарплаты менеджеров</h1>
            <p className="text-[11px] text-muted-foreground">Оклад + KPI-бонус текущего периода</p>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-5">
        {/* Итоги */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Общий фонд оплаты', value: `${(totalPayout / 1000).toFixed(0)}K KGS`, color: 'text-primary' },
            { label: 'Итого окладов',     value: `${(totalBase  / 1000).toFixed(0)}K KGS`, color: 'text-foreground' },
            { label: 'Итого бонусов',     value: `${(totalBonus / 1000).toFixed(0)}K KGS`, color: 'text-emerald-500' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-card p-4 text-center">
              <p className={cn('text-2xl font-bold font-mono', s.color)}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Таблица */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Детальный расчёт</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground font-medium">Менеджер</th>
                  <th className="text-right py-2 text-muted-foreground font-medium">Выручка</th>
                  <th className="text-right py-2 text-muted-foreground font-medium">Оклад</th>
                  <th className="text-right py-2 text-muted-foreground font-medium">Бонус %</th>
                  <th className="text-right py-2 text-muted-foreground font-medium">Бонус</th>
                  <th className="text-right py-2 text-muted-foreground font-medium">Итого</th>
                </tr>
              </thead>
              <tbody>
                {salaryData.map((m) => (
                  <tr key={m.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="py-2.5 font-medium text-foreground">{m.name}</td>
                    <td className="py-2.5 text-right text-muted-foreground font-mono">{(m.revenue / 1_000_000).toFixed(2)}M</td>
                    <td className="py-2.5 text-right text-foreground font-mono">{m.baseSalary.toLocaleString('ru-RU')}</td>
                    <td className="py-2.5 text-right">
                      <span className={cn(
                        'px-1.5 py-0.5 rounded-full text-[10px] font-semibold',
                        m.bonusPct >= 12 ? 'bg-emerald-500/10 text-emerald-600' :
                        m.bonusPct >= 8  ? 'bg-blue-500/10 text-blue-600' :
                        'bg-amber-500/10 text-amber-600'
                      )}>
                        {m.bonusPct}%
                      </span>
                    </td>
                    <td className="py-2.5 text-right text-emerald-600 font-mono font-medium">
                      +{m.bonusAmount.toLocaleString('ru-RU')}
                    </td>
                    <td className="py-2.5 text-right font-mono font-bold text-foreground">
                      {(m.baseSalary + m.bonusAmount).toLocaleString('ru-RU')}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-border">
                  <td className="py-2 font-semibold text-foreground">Итого</td>
                  <td className="py-2" />
                  <td className="py-2 text-right font-mono font-semibold text-foreground">{totalBase.toLocaleString('ru-RU')}</td>
                  <td className="py-2" />
                  <td className="py-2 text-right font-mono font-semibold text-emerald-600">+{totalBonus.toLocaleString('ru-RU')}</td>
                  <td className="py-2 text-right font-mono font-bold text-primary">{totalPayout.toLocaleString('ru-RU')}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="text-[10px] text-muted-foreground mt-3">
            * Бонус рассчитывается как % от оклада пропорционально выполнению плана выручки 3M KGS
          </p>
        </div>
      </div>
    </div>
  );
}
