import { type Product, formatCurrency, formatNumber, generateDealsForProduct } from '@/data/mockData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProductDetailModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export function ProductDetailModal({ product, open, onClose }: ProductDetailModalProps) {
  if (!product) return null;

  const deals = generateDealsForProduct(product.id, product.name, product.deals);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold flex items-center justify-between">
            <span>{product.name}</span>
            <Badge variant={product.clientType === 'VIP' ? 'default' : 'secondary'} className="text-xs">
              {product.clientType}
            </Badge>
          </DialogTitle>
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

        <Tabs defaultValue="chart" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chart" className="text-xs">График</TabsTrigger>
            <TabsTrigger value="deals" className="text-xs">Сделки ({deals.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="chart" className="space-y-4">
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

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Регион: {product.region}</span>
              <span>Тип клиента: {product.clientType}</span>
            </div>
          </TabsContent>

          <TabsContent value="deals" className="space-y-3">
            {deals.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">Нет сделок</p>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {deals.map((deal) => (
                  <div
                    key={deal.id}
                    className="flex items-center justify-between rounded-lg border border-border p-2 hover:bg-secondary transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{deal.clientName}</p>
                      <p className="text-xs text-muted-foreground">{deal.date}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant="outline" className="text-xs">
                        {deal.clientType}
                      </Badge>
                      <p className="text-xs font-mono font-semibold">{formatCurrency(deal.amount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
