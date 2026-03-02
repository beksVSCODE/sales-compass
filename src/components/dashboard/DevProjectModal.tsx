import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { type DevProject, type TaskStatus, type TaskPriority } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { ExternalLink, Flame, CalendarDays, CalendarCheck2, Users, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

// ─── Конфигурации статусов и приоритетов ────────────────────────────────────
const taskStatusConfig: Record<TaskStatus, { label: string; color: string; bg: string }> = {
    todo:        { label: 'Не начата',      color: 'text-muted-foreground', bg: 'bg-muted/60'        },
    in_progress: { label: 'В работе',       color: 'text-blue-500',         bg: 'bg-blue-500/10'     },
    review:      { label: 'На проверке',    color: 'text-violet-500',       bg: 'bg-violet-500/10'   },
    done:        { label: 'Выполнена',      color: 'text-emerald-500',      bg: 'bg-emerald-500/10'  },
    blocked:     { label: 'Заблокирована',  color: 'text-red-500',          bg: 'bg-red-500/10'      },
};

const taskPriorityConfig: Record<TaskPriority, { label: string; color: string; dot: string }> = {
    low:      { label: 'Низкий',      color: 'text-slate-400',  dot: 'bg-slate-400'  },
    medium:   { label: 'Средний',     color: 'text-blue-400',   dot: 'bg-blue-400'   },
    high:     { label: 'Высокий',     color: 'text-amber-500',  dot: 'bg-amber-500'  },
    critical: { label: 'Критический', color: 'text-red-500',    dot: 'bg-red-500'    },
};

const projectStatusConfig: Record<DevProject['status'], { label: string; color: string; bg: string }> = {
    active:    { label: 'Активный',   color: 'text-blue-500',    bg: 'bg-blue-500/10'    },
    completed: { label: 'Завершён',   color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    overdue:   { label: 'Просрочен',  color: 'text-red-500',     bg: 'bg-red-500/10'     },
    at_risk:   { label: 'Под риском', color: 'text-amber-500',   bg: 'bg-amber-500/10'   },
};

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}

function formatShortDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
    });
}

// ─── Компонент модального окна ───────────────────────────────────────────────
interface DevProjectModalProps {
    project: DevProject | null;
    onClose: () => void;
}

export function DevProjectModal({ project, onClose }: DevProjectModalProps) {
    if (!project) return null;

    const statusCfg = projectStatusConfig[project.status];
    const doneTasks  = project.tasks.filter((t) => t.status === 'done').length;
    const totalTasks = project.tasks.length;
    const progress   = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

    return (
        <Dialog open={!!project} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                {/* ── Заголовок ── */}
                <DialogHeader className="pr-6">
                    <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                            <DialogTitle className="text-base leading-snug">{project.name}</DialogTitle>
                            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                                {project.description}
                            </p>
                        </div>
                        <span className={cn(
                            'shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full',
                            statusCfg.bg, statusCfg.color
                        )}>
                            {statusCfg.label}
                        </span>
                    </div>
                </DialogHeader>

                {/* ── Мета-информация ── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
                    <div className="rounded-lg border border-border bg-muted/30 p-2.5">
                        <div className="flex items-center gap-1 mb-1">
                            <CalendarDays className="w-3 h-3 text-muted-foreground" />
                            <p className="text-[10px] text-muted-foreground">Начало</p>
                        </div>
                        <p className="text-xs font-medium">{formatDate(project.startDate)}</p>
                    </div>

                    <div className="rounded-lg border border-border bg-muted/30 p-2.5">
                        <div className="flex items-center gap-1 mb-1">
                            <CalendarCheck2 className="w-3 h-3 text-muted-foreground" />
                            <p className="text-[10px] text-muted-foreground">Дедлайн</p>
                        </div>
                        <p className={cn(
                            'text-xs font-medium',
                            project.status === 'overdue' ? 'text-red-500' :
                            project.status === 'at_risk' ? 'text-amber-500' : ''
                        )}>
                            {formatDate(project.deadline)}
                        </p>
                    </div>

                    <div className="rounded-lg border border-border bg-muted/30 p-2.5">
                        <div className="flex items-center gap-1 mb-1">
                            <CheckCircle2 className="w-3 h-3 text-muted-foreground" />
                            <p className="text-[10px] text-muted-foreground">Задачи</p>
                        </div>
                        <p className="text-xs font-medium">{doneTasks} / {totalTasks}</p>
                    </div>

                    {project.status !== 'completed' ? (
                        <div className="rounded-lg border border-border bg-muted/30 p-2.5">
                            <div className="flex items-center gap-1 mb-1">
                                <Users className="w-3 h-3 text-muted-foreground" />
                                <p className="text-[10px] text-muted-foreground">Загрузка</p>
                            </div>
                            <p className={cn(
                                'text-xs font-medium',
                                project.teamLoad >= 90 ? 'text-red-500' :
                                project.teamLoad >= 75 ? 'text-amber-500' : ''
                            )}>
                                {project.teamLoad}%
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2.5">
                            <div className="flex items-center gap-1 mb-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                <p className="text-[10px] text-emerald-500 font-bold">Завершён</p>
                            </div>
                            <p className="text-xs font-medium text-emerald-500">Все задачи выполнены</p>
                        </div>
                    )}
                </div>

                {/* Баннер «Превышен бюджет» */}
                {project.overBudget && (
                    <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2">
                        <Flame className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <p className="text-xs font-bold text-red-500">Превышен бюджет проекта</p>
                    </div>
                )}

                {/* ── Прогресс-бар ── */}
                {totalTasks > 0 && (
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[11px] text-muted-foreground">
                            <span>Прогресс задач</span>
                            <span className="font-mono font-semibold">{progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div
                                className={cn(
                                    'h-full rounded-full transition-all duration-700',
                                    progress === 100 ? 'bg-emerald-500' :
                                    progress >= 60   ? 'bg-blue-500' :
                                    progress >= 30   ? 'bg-amber-500' : 'bg-red-500'
                                )}
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* ── Список задач ── */}
                <div className="space-y-2">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                        Задачи ({totalTasks})
                    </p>

                    {project.tasks.length === 0 && (
                        <p className="text-xs text-muted-foreground py-4 text-center">Задачи не добавлены</p>
                    )}

                    {project.tasks.map((task) => {
                        const sCfg = taskStatusConfig[task.status];
                        const pCfg = taskPriorityConfig[task.priority];
                        const isClickable = !!task.url;

                        return (
                            <div
                                key={task.id}
                                className={cn(
                                    'group rounded-xl border border-border px-3 py-2.5 text-xs transition-all',
                                    isClickable
                                        ? 'cursor-pointer hover:border-primary/40 hover:bg-muted/40 hover:shadow-sm'
                                        : ''
                                )}
                                onClick={() => {
                                    if (task.url) {
                                        toast.info('Переход к задаче', {
                                            description: `«${task.title}» — функция в разработке`,
                                            duration: 3000,
                                        });
                                    }
                                }}
                                title={isClickable ? 'Открыть задачу' : undefined}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    {/* Левая часть */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <span className={cn(
                                                'font-semibold truncate',
                                                task.status === 'done'
                                                    ? 'line-through text-muted-foreground'
                                                    : 'text-foreground'
                                            )}>
                                                {task.title}
                                            </span>
                                            {isClickable && (
                                                <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                            )}
                                        </div>

                                        {/* Бейджи */}
                                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                            <span className={cn(
                                                'px-1.5 py-0.5 rounded-full text-[10px] font-bold',
                                                sCfg.bg, sCfg.color
                                            )}>
                                                {sCfg.label}
                                            </span>
                                            <span className="flex items-center gap-1 text-[10px] font-semibold">
                                                <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', pCfg.dot)} />
                                                <span className={pCfg.color}>{pCfg.label}</span>
                                            </span>
                                            <span className="text-[10px] text-muted-foreground">
                                                👤 {task.assignee}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Дата */}
                                    {task.dueDate && (
                                        <span className="text-[10px] font-mono text-muted-foreground shrink-0 mt-0.5 tabular-nums">
                                            {formatShortDate(task.dueDate)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </DialogContent>
        </Dialog>
    );
}
