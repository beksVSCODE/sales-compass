import { ManagersTable } from '@/components/dashboard/ManagersTable';
import { SalesFunnel } from '@/components/dashboard/SalesFunnel';
import { DevProjects } from '@/components/dashboard/DevProjects';
import { MarketingROI } from '@/components/dashboard/MarketingROI';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { kpiData, calcChange, stuckDeals, devProjects } from '@/data/mockData';
import { TrendingUp, ShoppingCart, Receipt, BarChart2, Megaphone, Code2, Target, AlertTriangle, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function Departments() {
  const navigate = useNavigate();

  const kpi = {
    revenue:    calcChange(kpiData.totalRevenue.current,   kpiData.totalRevenue.previous),
    deals:      calcChange(kpiData.closedDeals.current,    kpiData.closedDeals.previous),
    leads:      calcChange(kpiData.leads.current,          kpiData.leads.previous),
    conversion: calcChange(kpiData.conversionRate.current, kpiData.conversionRate.previous),
    adSpend:    calcChange(kpiData.adSpend.current,        kpiData.adSpend.previous),
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50 sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="h-8 text-xs">
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />Дашборд
          </Button>
          <div>
            <h1 className="text-base font-bold text-foreground">Отделы</h1>
            <p className="text-[11px] text-muted-foreground">Детализация по отделам компании</p>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">
        <Tabs defaultValue="sales">
          <TabsList className="h-9">
            <TabsTrigger value="sales"     className="text-xs gap-1.5"><Users   className="w-3.5 h-3.5" />Продажи</TabsTrigger>
            <TabsTrigger value="marketing" className="text-xs gap-1.5"><Megaphone className="w-3.5 h-3.5" />Маркетинг</TabsTrigger>
            <TabsTrigger value="dev"       className="text-xs gap-1.5"><Code2   className="w-3.5 h-3.5" />Разработка</TabsTrigger>
          </TabsList>

          {/* Продажи */}
          <TabsContent value="sales" className="mt-5 space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <KpiCard label="Выручка"        value={`${(kpiData.totalRevenue.current / 1_000_000).toFixed(1)}M`} unit="KGS" change={kpi.revenue}    icon={TrendingUp}   iconColor="text-primary"     />
              <KpiCard label="Сделок"         value={String(kpiData.closedDeals.current)}                         change={kpi.deals}                 icon={ShoppingCart} iconColor="text-chart-2"     />
              <KpiCard label="Средний чек"    value={`${(kpiData.avgCheck.current / 1000).toFixed(0)}K`}          unit="KGS" change={calcChange(kpiData.avgCheck.current, kpiData.avgCheck.previous)} icon={Receipt} iconColor="text-chart-3" />
              <KpiCard label="Конверсия"      value={`${kpiData.conversionRate.current}%`}                        change={kpi.conversion}            icon={BarChart2}    iconColor="text-emerald-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ManagersTable />
              <SalesFunnel />
            </div>

            {/* Зависшие сделки */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-semibold text-foreground">Зависшие сделки ({stuckDeals.length})</h3>
              </div>
              <div className="space-y-2">
                {stuckDeals.map((d) => (
                  <div key={d.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5 text-xs">
                    <div>
                      <p className="font-medium text-foreground">{d.clientName}</p>
                      <p className="text-muted-foreground">{d.manager} · {d.stage}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-semibold text-foreground">{(d.amount / 1000).toFixed(0)}K KGS</p>
                      <p className={`font-medium ${d.daysSinceLastActivity >= 21 ? 'text-red-500' : 'text-amber-500'}`}>
                        {d.daysSinceLastActivity} дн.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Маркетинг */}
          <TabsContent value="marketing" className="mt-5 space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <KpiCard label="Лиды"             value={String(kpiData.leads.current)}                            change={kpi.leads}    icon={Target}    iconColor="text-blue-500"  />
              <KpiCard label="Расходы на рекл." value={`${(kpiData.adSpend.current / 1_000_000).toFixed(2)}M`} unit="KGS" change={kpi.adSpend} invertTrend icon={Megaphone} iconColor="text-amber-500" />
              <KpiCard label="Конверсия"        value={`${kpiData.conversionRate.current}%`}                     change={kpi.conversion} icon={BarChart2} iconColor="text-emerald-500" />
            </div>
            <MarketingROI />
          </TabsContent>

          {/* Разработка */}
          <TabsContent value="dev" className="mt-5">
            <DevProjects />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
