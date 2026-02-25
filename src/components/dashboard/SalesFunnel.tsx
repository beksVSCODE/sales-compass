import { salesFunnel } from '@/data/mockData';
import { Filter } from 'lucide-react';

export function SalesFunnel() {
  const total = salesFunnel[0]?.count ?? 1;
  const last  = salesFunnel[salesFunnel.length - 1]?.count ?? 0;

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Filter className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Воронка продаж</h3>
        </div>
        <div className="text-xs text-muted-foreground">
          Конверсия:{' '}
          <span className="font-bold text-emerald-500 font-mono">
            {((last / total) * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Стадии */}
      <div className="space-y-2">
        {salesFunnel.map((stage, i) => {
          const pct     = (stage.count / total) * 100;
          const dropPct = i > 0
            ? (((salesFunnel[i - 1].count - stage.count) / salesFunnel[i - 1].count) * 100).toFixed(0)
            : null;

          return (
            <div key={stage.stage}>
              {dropPct && (
                <div className="flex items-center gap-1.5 ml-28 mb-1">
                  <div className="w-px h-3 bg-border ml-1" />
                  <span className="text-[10px] text-muted-foreground">↓ отсев {dropPct}%</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <span className="w-24 text-xs text-muted-foreground text-right shrink-0 font-medium">
                  {stage.stage}
                </span>
                <div className="flex-1 relative h-7 bg-muted/40 rounded-lg overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full rounded-lg flex items-center justify-between px-2.5 transition-all duration-700"
                    style={{ width: `${pct}%`, backgroundColor: stage.color }}
                  >
                    {pct > 20 && (
                      <span className="text-[11px] font-bold text-white drop-shadow-sm">
                        {stage.count}
                      </span>
                    )}
                  </div>
                  {pct <= 20 && (
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[11px] font-bold text-muted-foreground">
                      {stage.count}
                    </span>
                  )}
                </div>
                <span className="w-9 text-xs font-semibold text-muted-foreground shrink-0 font-mono">
                  {pct.toFixed(0)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Итог */}
      <div className="flex items-center justify-between rounded-lg bg-emerald-500/8 border border-emerald-500/20 px-3 py-2 text-xs">
        <span className="text-muted-foreground">Из {total} лидов закрыто</span>
        <span className="font-bold text-emerald-600 font-mono">{last} сделок</span>
      </div>
    </div>
  );
}
