import { managers } from '@/data/mockData';
import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

const medals = [
  { icon: '🥇', ring: 'ring-amber-400',   bg: 'bg-amber-50  dark:bg-amber-500/10' },
  { icon: '🥈', ring: 'ring-slate-400',   bg: 'bg-slate-50  dark:bg-slate-500/10' },
  { icon: '🥉', ring: 'ring-orange-400',  bg: 'bg-orange-50 dark:bg-orange-500/10' },
];

export function ManagersTable() {
  const sorted    = [...managers].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  const maxRevenue = sorted[0]?.revenue ?? 1;

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      {/* Заголовок */}
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-amber-500/10">
          <Trophy className="w-4 h-4 text-amber-500" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">Топ-5 менеджеров</h3>
      </div>

      <div className="space-y-2">
        {sorted.map((m, i) => {
          const medal = medals[i];
          const barWidth = `${(m.revenue / maxRevenue) * 100}%`;

          return (
            <div
              key={m.id}
              className={cn(
                'relative rounded-lg border border-border/60 p-3 transition-all hover:border-border hover:shadow-sm',
                i === 0 && 'border-amber-400/40 bg-amber-500/[0.03]'
              )}
            >
              {/* Прогресс-бар фон */}
              <div
                className="absolute inset-0 rounded-lg bg-primary/[0.03] transition-all duration-700"
                style={{ width: barWidth }}
              />

              <div className="relative flex items-center gap-3">
                {/* Аватар/медаль */}
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm ring-2 shrink-0',
                  medal ? medal.ring + ' ' + medal.bg : 'ring-border bg-muted'
                )}>
                  {medal ? medal.icon : <span className="text-xs font-bold text-muted-foreground">{i + 1}</span>}
                </div>

                {/* Имя + метрики */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground truncate">{m.name}</p>
                    <p className="font-mono text-sm font-bold text-foreground ml-2 shrink-0">
                      {(m.revenue / 1_000_000).toFixed(2)}<span className="text-xs font-normal text-muted-foreground">M</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">{m.deals}</span> сд.
                    </span>
                    <span className={cn(
                      'text-xs px-1.5 py-0.5 rounded-full font-semibold',
                      m.conversion >= 70 ? 'bg-emerald-500/10 text-emerald-600' :
                      m.conversion >= 55 ? 'bg-amber-500/10 text-amber-600' :
                                           'bg-red-500/10 text-red-600'
                    )}>
                      {m.conversion}%
                    </span>
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                      цикл: <span className="text-foreground font-medium">{m.avgCycleDays} дн.</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-4 text-[10px] text-muted-foreground pt-1 border-t border-border/60">
        <span>сд. = закрытых сделок</span>
        <span>% = конверсия</span>
        <span>M = млн KGS</span>
      </div>
    </div>
  );
}
