import { type Product, formatCurrency, formatNumber } from '@/data/mockData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface ProductDetailModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export function ProductDetailModal({ product, open, onClose }: ProductDetailModalProps) {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="rounded-lg bg-secondary p-3">
            <p className="text-xs text-muted-foreground mb-1">Выручка</p>
            <p className="font-mono text-sm font-semibold">{formatCurrency(product.revenue)}</p>
          </div>
          <div className="rounded-lg bg-secondary p-3">
            <p className="text-xs text-muted-foreground mb-1">Сделки</p>
            <p className="font-mono text-sm font-semibold">{formatNumber(product.deals)}</p>
          </div>
          <div className="rounded-lg bg-secondary p-3">
            <p className="text-xs text-muted-foreground mb-1">Средний чек</p>
            <p className="font-mono text-sm font-semibold">{formatCurrency(product.avgCheck)}</p>
          </div>
          <div className="rounded-lg bg-secondary p-3">
            <p className="text-xs text-muted-foreground mb-1">Категория</p>
            <p className="text-sm font-medium">{product.category}</p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Выручка по месяцам</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={product.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(220, 9%, 46%)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(220, 9%, 46%)' }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), 'Выручка']}
                contentStyle={{ borderRadius: 8, border: '1px solid hsl(220, 13%, 91%)', fontSize: 12 }}
              />
              <Bar dataKey="revenue" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>Регион: {product.region}</span>
          <span>Тип клиента: {product.clientType}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
