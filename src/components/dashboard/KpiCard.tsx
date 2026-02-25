import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  label: string;
  value: string;
  change: number;
  icon: LucideIcon;
  iconColor?: string;
  accentColor?: string;
  unit?: string;
  invertTrend?: boolean;
  onClick?: () => void;
  detail?: string;
}

export function KpiCard({
  label,
  value,
  change,
  icon: Icon,
  iconColor = 'text-primary',
  accentColor = 'bg-primary',
  unit,
  invertTrend = false,
  onClick,
  detail,
}: KpiCardProps) {
  const isPositive = invertTrend ? change < 0 : change > 0;
  const isNeutral  = change === 0;

  const TrendIcon  = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;
  const trendColor = isNeutral ? 'text-muted-foreground' : isPositive ? 'text-emerald-500' : 'text-red-500';
  const bgTrend    = isNeutral ? 'bg-muted/50' : isPositive ? 'bg-emerald-500/10' : 'bg-red-500/10';

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative rounded-xl border border-border bg-card overflow-hidden fade-in',
        'transition-all duration-200',
        onClick && 'cursor-pointer hover:border-primary/40 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5'
      )}
    >
      {/* Цветная левая полоса */}
      <div className={cn('absolute left-0 top-0 bottom-0 w-1 rounded-l-xl', accentColor)} />

      <div className="pl-5 pr-4 py-4 space-y-3">
        {/* Заголовок */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
            {label}
          </span>
          <div className={cn('p-1.5 rounded-lg bg-muted/50')}>
            <Icon className={cn('w-4 h-4', iconColor)} />
          </div>
        </div>

        {/* Значение */}
        <div className="count-up">
          <p className="font-mono text-2xl font-bold text-foreground leading-none tracking-tight">
            {value}
            {unit && <span className="text-sm font-normal text-muted-foreground ml-1.5">{unit}</span>}
          </p>
          {detail && <p className="text-xs text-muted-foreground mt-1">{detail}</p>}
        </div>

        {/* Тренд */}
        <div className={cn(
          'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
          bgTrend, trendColor
        )}>
          <TrendIcon className="w-3 h-3" />
          <span>
            {isNeutral ? 'Без изм.' : `${change > 0 ? '+' : ''}${change.toFixed(1)}%`}
          </span>
          <span className="text-muted-foreground font-normal ml-0.5 hidden sm:inline">vs прошлый</span>
        </div>
      </div>
    </div>
  );
}
