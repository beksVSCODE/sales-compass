import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { stuckDeals, managers, marketingChannels, devProjects, formatCurrency } from '@/data/mockData';
import { cn } from '@/lib/utils';

export type DetailType =
  | 'revenue'
  | 'deals'
  | 'avgCheck'
  | 'margin'
  | 'leads'
  | 'conversion'
  | 'adSpend'
  | null;

interface DetailModalProps {
  type: DetailType;
  onClose: () => void;
}

export function DetailModal({ type, onClose }: DetailModalProps) {
  if (!type) return null;

  const content = buildContent(type);

  return (
    <Dialog open={!!type} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">{content.title}</DialogTitle>
          <DialogDescription className="text-xs">{content.description}</DialogDescription>
        </DialogHeader>
        <div className="mt-2">{content.body}</div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Билдеры контента ────────────────────────────────────────────────────────
function buildContent(type: NonNullable<DetailType>) {
  switch (type) {
    case 'deals':
      return {
        title: 'Зависшие сделки',
        description: 'Сделки без активности более 14 дней',
        body: (
          <div className="space-y-2">
            {stuckDeals.map((d) => (
              <div key={d.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5 text-xs">
                <div>
                  <p className="font-medium text-foreground">{d.clientName}</p>
                  <p className="text-muted-foreground">{d.manager} · {d.stage}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{(d.amount / 1000).toFixed(0)}K KGS</p>
                  <p className={cn('text-muted-foreground', d.daysSinceLastActivity >= 21 ? 'text-red-500' : 'text-amber-500')}>
                    {d.daysSinceLastActivity} дн. простоя
                  </p>
                </div>
              </div>
            ))}
          </div>
        ),
      };

    case 'revenue':
      return {
        title: 'Разбивка выручки по менеджерам',
        description: 'Детальный вклад каждого менеджера',
        body: (
          <div className="space-y-2">
            {[...managers].sort((a, b) => b.revenue - a.revenue).map((m, i) => (
              <div key={m.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-5 text-muted-foreground">{i + 1}.</span>
                  <div>
                    <p className="font-medium text-foreground">{m.name}</p>
                    <p className="text-muted-foreground">Цикл: {m.avgCycleDays} дн. · Конв.: {m.conversion}%</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{(m.revenue / 1_000_000).toFixed(2)}M KGS</p>
                  <p className="text-muted-foreground">{m.deals} сделок</p>
                </div>
              </div>
            ))}
          </div>
        ),
      };

    case 'avgCheck':
      return {
        title: 'Средний чек по менеджерам',
        description: 'Сравнение среднего чека среди команды продаж',
        body: (
          <div className="space-y-2">
            {[...managers].sort((a, b) => b.avgCheck - a.avgCheck).map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5 text-xs">
                <span className="font-medium text-foreground">{m.name}</span>
                <span className="font-mono font-semibold text-foreground">
                  {m.avgCheck.toLocaleString('ru-RU')} KGS
                </span>
              </div>
            ))}
          </div>
        ),
      };

    case 'leads':
      return {
        title: 'Лиды по каналам',
        description: 'Количество лидов и стоимость привлечения по каждому каналу',
        body: (
          <div className="space-y-2">
            {[...marketingChannels].sort((a, b) => b.leads - a.leads).map((ch) => (
              <div key={ch.channel} className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5 text-xs">
                <div>
                  <p className="font-medium text-foreground">{ch.channel}</p>
                  <p className="text-muted-foreground">Конв.: {ch.conversion}%</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{ch.leads} лидов</p>
                  <p className="text-muted-foreground">{ch.costPerLead.toLocaleString('ru-RU')} KGS / лид</p>
                </div>
              </div>
            ))}
          </div>
        ),
      };

    case 'adSpend':
      return {
        title: 'Расходы на рекламу по каналам',
        description: 'ROI и расходы по каждому маркетинговому каналу',
        body: (
          <div className="space-y-2">
            {[...marketingChannels].sort((a, b) => b.spend - a.spend).map((ch) => (
              <div key={ch.channel} className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5 text-xs">
                <div>
                  <p className="font-medium text-foreground">{ch.channel}</p>
                  <p className="text-muted-foreground">Выручка: {(ch.revenue / 1_000_000).toFixed(2)}M KGS</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{(ch.spend / 1000).toFixed(0)}K KGS</p>
                  <p className={cn('font-semibold', ch.roi >= 300 ? 'text-emerald-500' : 'text-amber-500')}>
                    ROI: {ch.roi}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        ),
      };

    case 'margin':
      return {
        title: 'Маржинальность',
        description: 'Формула: (Прибыль / Выручка) × 100%',
        body: (
          <div className="space-y-3 text-xs">
            <div className="rounded-lg bg-muted/40 p-4 space-y-2">
              <p className="text-muted-foreground">Маржинальность = (Прибыль / Выручка) × 100%</p>
              <p className="text-muted-foreground">Текущий показатель основан на агрегированных данных всех сделок.</p>
              <p className="font-semibold text-foreground text-sm">Маржинальность: 34.2%</p>
            </div>
            <p className="text-muted-foreground">
              Для получения точных данных необходима себестоимость по каждой сделке из CRM Bitrix.
            </p>
          </div>
        ),
      };

    case 'conversion':
      return {
        title: 'Конверсия лиды → сделки',
        description: 'Формула: Закрытые сделки / Все лиды × 100%',
        body: (
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-muted/40 p-3 text-center">
                <p className="text-2xl font-bold text-foreground">1 575</p>
                <p className="text-muted-foreground">Всего лидов</p>
              </div>
              <div className="rounded-lg bg-muted/40 p-3 text-center">
                <p className="text-2xl font-bold text-emerald-500">418</p>
                <p className="text-muted-foreground">Закрытых сделок</p>
              </div>
            </div>
            <div className="rounded-lg border border-border p-3 text-center">
              <p className="text-3xl font-bold text-primary">26.5%</p>
              <p className="text-muted-foreground">Итоговая конверсия</p>
            </div>
          </div>
        ),
      };

    default:
      return { title: '', description: '', body: null };
  }
}
