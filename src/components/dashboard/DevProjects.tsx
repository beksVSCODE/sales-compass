import { useState } from 'react';
import { devProjects, type DevProject } from '@/data/mockData';
import { Code2, AlertTriangle, CheckCircle2, Clock, XCircle, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DevProjectModal } from './DevProjectModal';

const statusConfig: Record<
  DevProject['status'],
  { label: string; color: string; bg: string; border: string; icon: typeof Clock }
> = {
  active:    { label: 'Активный',   color: 'text-blue-500',    bg: 'bg-blue-500/10',    border: 'border-blue-500/20',    icon: Clock         },
  completed: { label: 'Завершён',   color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle2  },
  overdue:   { label: 'Просрочен',  color: 'text-red-500',     bg: 'bg-red-500/10',     border: 'border-red-500/20',     icon: XCircle       },
  at_risk:   { label: 'Под риском', color: 'text-amber-500',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   icon: AlertTriangle },
};

export function DevProjects() {
  const [selectedProject, setSelectedProject] = useState<DevProject | null>(null);

  const active    = devProjects.filter((p) => p.status === 'active').length;
  const completed = devProjects.filter((p) => p.status === 'completed').length;
  const overdue   = devProjects.filter((p) => p.status === 'overdue').length;
  const atRisk    = devProjects.filter((p) => p.status === 'at_risk').length;
  const overBudgetCount = devProjects.filter((p) => p.overBudget).length;

  const activeProjects = devProjects.filter((p) => p.status === 'active' || p.status === 'at_risk');
  const avgTeamLoad = activeProjects.length
    ? Math.round(activeProjects.reduce((s, p) => s + p.teamLoad, 0) / activeProjects.length)
    : 0;

  const totalTasks = devProjects.reduce((s, p) => s + p.tasksInProgress, 0);

  const summary = [
    { label: 'Активных',     value: active,    color: 'text-blue-500',    bg: 'bg-blue-500/10',    icon: Clock         },
    { label: 'Завершённых',  value: completed, color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: CheckCircle2  },
    { label: 'Просроченных', value: overdue,   color: 'text-red-500',     bg: 'bg-red-500/10',     icon: XCircle       },
    { label: 'Под риском',   value: atRisk,    color: 'text-amber-500',   bg: 'bg-amber-500/10',   icon: AlertTriangle },
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-5">
      {/* Заголовок */}
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-violet-500/10">
          <Code2 className="w-4 h-4 text-violet-500" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">Отдел разработки</h3>
      </div>

      {/* Статус-карточки */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {summary.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={cn('rounded-xl p-3 border transition-all hover:shadow-sm', s.bg, 'border-transparent')}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className={cn('w-3.5 h-3.5', s.color)} />
                <span className="text-[11px] text-muted-foreground font-medium">{s.label}</span>
              </div>
              <p className={cn('text-2xl font-bold font-mono', s.color)}>{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Доп. метрики */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-muted/30 p-3 text-center">
          <p className={cn('font-mono text-xl font-bold', avgTeamLoad >= 90 ? 'text-red-500' : avgTeamLoad >= 75 ? 'text-amber-500' : 'text-foreground')}>
            {avgTeamLoad}%
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Ср. загрузка</p>
        </div>
        <div className="rounded-xl border border-border bg-muted/30 p-3 text-center">
          <p className="font-mono text-xl font-bold text-foreground">{totalTasks}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Задач в работе</p>
        </div>
        <div className="rounded-xl border border-border bg-muted/30 p-3 text-center">
          <p className={cn('font-mono text-xl font-bold', overBudgetCount > 0 ? 'text-red-500' : 'text-emerald-500')}>
            {overBudgetCount}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">За бюджетом</p>
        </div>
      </div>

      {/* Список проектов */}
      <div className="space-y-2">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Проекты</p>
        {devProjects.map((p) => {
          const cfg  = statusConfig[p.status];
          const Icon = cfg.icon;
          return (
            <div
              key={p.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedProject(p)}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedProject(p)}
              className={cn(
                'group flex items-center justify-between rounded-xl border px-3 py-2.5 text-xs transition-all hover:shadow-sm cursor-pointer select-none',
                cfg.border, cfg.bg
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={cn('w-3.5 h-3.5 shrink-0', cfg.color)} />
                <div className="min-w-0">
                  <p className={cn('font-semibold truncate', p.status === 'completed' ? 'text-muted-foreground line-through' : 'text-foreground')}>
                    {p.name}
                  </p>
                  {p.overBudget && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-red-500">
                      <Flame className="w-2.5 h-2.5" />Превышен бюджет
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 ml-3">
                {/* Загрузка команды */}
                {p.status !== 'completed' && (
                  <div className="hidden sm:flex items-center gap-1.5">
                    <div className="w-14 h-1.5 bg-muted/60 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          p.teamLoad >= 90 ? 'bg-red-500' :
                          p.teamLoad >= 75 ? 'bg-amber-500' : 'bg-blue-500'
                        )}
                        style={{ width: `${p.teamLoad}%` }}
                      />
                    </div>
                    <span className="text-muted-foreground text-[10px] w-6 font-mono">{p.teamLoad}%</span>
                  </div>
                )}

                {/* Дедлайн */}
                <span className={cn(
                  'font-mono text-[11px] font-semibold px-1.5 py-0.5 rounded-full',
                  p.status === 'completed' ? 'text-emerald-500 bg-emerald-500/10' :
                  p.daysLeft < 0  ? 'text-red-500 bg-red-500/10' :
                  p.daysLeft <= 14 ? 'text-amber-500 bg-amber-500/10' :
                  'text-muted-foreground bg-muted/60'
                )}>
                  {p.status === 'completed' ? '✓' :
                   p.daysLeft < 0 ? `+${Math.abs(p.daysLeft)}д` :
                   `${p.daysLeft}д`}
                </span>

                {/* Статус-бейдж */}
                <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-bold hidden sm:inline', cfg.bg, cfg.color)}>
                  {cfg.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <DevProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
