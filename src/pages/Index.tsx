import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  products as allProducts, crossSales, months, type Filters, type Product,
  SIMULATE_DATA_ERROR, kpiData, calcChange, managers, stuckDeals,
  marketingChannels, devProjects, monthlyPlanFact
} from '@/data/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  LogOut, Shield, User, Download, TrendingUp, ShoppingCart, Receipt,
  Percent, Users, BarChart2, Megaphone, Code2, Target, AlertTriangle,
  FileText, Crown, Moon, Sun
} from 'lucide-react';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { FilterPanel } from '@/components/dashboard/FilterPanel';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { ProductCard } from '@/components/dashboard/ProductCard';
import { ProductDetailModal } from '@/components/dashboard/ProductDetailModal';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { DealsChart } from '@/components/dashboard/DealsChart';
import { AvgCheckChart } from '@/components/dashboard/AvgCheckChart';
import { CrossSalesHeatmap } from '@/components/dashboard/CrossSalesHeatmap';
import { AdminPanel } from '@/components/dashboard/AdminPanel';
import { ErrorState } from '@/components/dashboard/ErrorState';
import { NoResultsState } from '@/components/dashboard/NoResultsState';
import { SalesFunnel } from '@/components/dashboard/SalesFunnel';
import { ManagersTable } from '@/components/dashboard/ManagersTable';
import { PlanFactChart } from '@/components/dashboard/PlanFactChart';
import { MarketingROI } from '@/components/dashboard/MarketingROI';
import { DevProjects } from '@/components/dashboard/DevProjects';
import { DetailModal, type DetailType } from '@/components/dashboard/DetailModal';
import { useAuth } from '@/hooks/useAuth';
import { useExport } from '@/hooks/useExport';
import {
  exportProductsToCSV, exportProductsToJSON,
  exportStatsToCSV, exportCrossSalesToCSV, generateFilename,
} from '@/lib/export';
import { toast } from 'sonner';

type SortKey = 'revenue' | 'deals' | 'avgCheck';

const periodLabels: Record<string, string> = {
  month: 'Месяц', quarter: 'Квартал', year: 'Год'
};

const Index = () => {
  const { profile, role, isAdmin, isCeo, signOut } = useAuth();
  const { exportToExcel, exportToPdf } = useExport();

  // ── Фильтры ──────────────────────────────────────────────────────────────
  const [filters, setFilters] = useState<Filters>({
    period: 'month',
    categories: [],
    regions: [],
    clientTypes: [],
    dateRange: { startDate: null, endDate: null },
  });
  const [globalPeriod, setGlobalPeriod] = useState<'month' | 'quarter' | 'year'>('month');

  // ── UI состояния ─────────────────────────────────────────────────────────
  const [sortBy, setSortBy] = useState<SortKey>('revenue');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAllCards, setShowAllCards] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(() =>
    isCeo ? 'executive' : isAdmin ? 'finance' : 'sales'
  );
  const [detailType, setDetailType] = useState<DetailType>(null);
  const [isDark, setIsDark] = useState<boolean>(() => {
    return document.documentElement.classList.contains('dark');
  });

  // Переключение тёмной темы
  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      return next;
    });
  }, []);
  const [dataError, setDataError] = useState<string | null>(
    SIMULATE_DATA_ERROR ? 'Симуляция ошибки: Не удалось подключиться к серверу данных' : null
  );

  // ── Фильтрация продуктов ─────────────────────────────────────────────────
  const availableProducts = useMemo(() => {
    if (isAdmin || isCeo) return allProducts;
    return allProducts.filter((p) => {
      if (profile?.region && p.region !== profile.region) return false;
      if (profile?.category && p.category !== profile.category) return false;
      return true;
    });
  }, [isAdmin, isCeo, profile]);

  const filteredProducts = useMemo(() => {
    return availableProducts.filter((p) => {
      if (filters.categories.length > 0 && !filters.categories.includes(p.category)) return false;
      if (filters.regions.length > 0 && !filters.regions.includes(p.region)) return false;
      if (filters.clientTypes.length > 0 && !filters.clientTypes.includes(p.clientType)) return false;
      return true;
    });
  }, [filters, availableProducts]);

  const monthIndexByLabel = useMemo(() => new Map(months.map((m, i) => [m, i])), []);

  const normalizedRange = useMemo(() => {
    let start = filters.dateRange.startDate ? new Date(filters.dateRange.startDate) : null;
    let end = filters.dateRange.endDate ? new Date(filters.dateRange.endDate) : null;
    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(23, 59, 59, 999);
    if (start && end && start > end) {
      const tmp = start;
      start = end;
      end = tmp;
    }
    return { start, end, isActive: !!(start || end) };
  }, [filters.dateRange]);

  const reportProducts = useMemo(() => {
    if (!normalizedRange.isActive) return filteredProducts;

    const currentYear = new Date().getFullYear();
    return filteredProducts.map((p) => {
      const filteredMonthlyRevenue = p.monthlyRevenue.filter((entry) => {
        const monthIndex = monthIndexByLabel.get(entry.month);
        if (monthIndex === undefined) return false;
        const entryDate = new Date(currentYear, monthIndex, 1);
        if (normalizedRange.start && entryDate < normalizedRange.start) return false;
        if (normalizedRange.end && entryDate > normalizedRange.end) return false;
        return true;
      });

      const revenue = filteredMonthlyRevenue.reduce((s, m) => s + m.revenue, 0);
      const deals = filteredMonthlyRevenue.reduce((s, m) => s + m.deals, 0);
      const avgCheck = deals > 0 ? revenue / deals : 0;

      return {
        ...p,
        revenue,
        deals,
        avgCheck,
        monthlyRevenue: filteredMonthlyRevenue,
      };
    });
  }, [filteredProducts, monthIndexByLabel, normalizedRange]);

  const sortedProducts = useMemo(() => {
    return [...reportProducts].sort((a, b) => b[sortBy] - a[sortBy]);
  }, [reportProducts, sortBy]);

  // Показываем TOP 5 или все
  const displayedProducts = useMemo(() => {
    return showAllCards ? sortedProducts : sortedProducts.slice(0, 5);
  }, [sortedProducts, showAllCards]);

  const totalRevenue = useMemo(() => reportProducts.reduce((s, p) => s + p.revenue, 0), [reportProducts]);
  const productNames = useMemo(() => reportProducts.map((p) => p.name), [reportProducts]);

  // ── KPI данные ───────────────────────────────────────────────────────────
  const kpi = useMemo(() => ({
    revenue:    { ...kpiData.totalRevenue,   change: calcChange(kpiData.totalRevenue.current,   kpiData.totalRevenue.previous)   },
    deals:      { ...kpiData.closedDeals,    change: calcChange(kpiData.closedDeals.current,    kpiData.closedDeals.previous)    },
    avgCheck:   { ...kpiData.avgCheck,       change: calcChange(kpiData.avgCheck.current,       kpiData.avgCheck.previous)       },
    margin:     { ...kpiData.grossMargin,    change: calcChange(kpiData.grossMargin.current,    kpiData.grossMargin.previous)    },
    leads:      { ...kpiData.leads,          change: calcChange(kpiData.leads.current,          kpiData.leads.previous)          },
    conversion: { ...kpiData.conversionRate, change: calcChange(kpiData.conversionRate.current, kpiData.conversionRate.previous) },
    adSpend:    { ...kpiData.adSpend,        change: calcChange(kpiData.adSpend.current,        kpiData.adSpend.previous)        },
  }), []);

  // ── Роли и доступ к вкладкам ────────────────────────────────────────
  // CEO: все 5 вкладок | Админ: Финансы + Продажи + Маркетинг | Менеджер: Финансы + Продажи
  const visibleTabs = useMemo((): string[] => {
    if (isCeo) return ['executive', 'finance', 'sales', 'marketing', 'dev'];
    if (isAdmin) return ['finance', 'sales', 'marketing'];
    return ['finance', 'sales'];
  }, [isCeo, isAdmin]);

  useEffect(() => {
    if (!visibleTabs.includes(activeTab)) {
      setActiveTab(visibleTabs[0]);
    }
  }, [visibleTabs, activeTab]);

  // ── Обработчики ──────────────────────────────────────────────────────────
  const handleRefresh = useCallback(() => {
    try {
      if (!allProducts || allProducts.length === 0) {
        setDataError('Данные недоступны. Пожалуйста, попробуйте позже.');
        return;
      }
      setDataError(null);
      toast.success('Данные обновлены');
    } catch (error) {
      setDataError('Ошибка при обновлении данных');
      toast.error('Не удалось обновить данные');
    }
  }, []);

  const handleExport = useCallback((format: 'csv' | 'json') => {
    if (format === 'csv') {
      exportProductsToCSV(reportProducts, generateFilename('products'));
    } else {
      exportProductsToJSON(reportProducts, generateFilename('products', 'json'));
    }
    toast.success(`Данные экспортированы в ${format.toUpperCase()}`);
  }, [reportProducts]);

  const handleExportStats = useCallback(() => {
    exportStatsToCSV(reportProducts, generateFilename('stats'));
    toast.success('Статистика экспортирована');
  }, [reportProducts]);

  const handleExcelExport = useCallback(() => {
    const data = managers.map((m) => ({
      'Менеджер': m.name,
      'Выручка (KGS)': m.revenue,
      'Сделок': m.deals,
      'Средний чек (KGS)': m.avgCheck,
      'Конверсия (%)': m.conversion,
      'Цикл (дн.)': m.avgCycleDays,
    }));
    exportToExcel(data, 'ceo-dashboard-managers');
  }, [exportToExcel]);

  const handlePdfExport = useCallback(() => {
    exportToPdf('ceo-dashboard', 'ceo-dashboard');
  }, [exportToPdf]);

  const handleExportCrossSales = useCallback(() => {
    const accessibleCrossSales = crossSales.filter(cs => {
      const p1 = reportProducts.some(p => p.name === cs.product1);
      const p2 = reportProducts.some(p => p.name === cs.product2);
      return p1 && p2;
    });
    exportCrossSalesToCSV(accessibleCrossSales, generateFilename('cross-sales'));
    toast.success('Кросс-продажи экспортированы');
  }, [reportProducts]);

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: 'revenue',  label: 'Выручка'  },
    { key: 'deals',    label: 'Сделки'   },
    { key: 'avgCheck', label: 'Ср. чек'  },
  ];

  // ── Рендер ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <div className="border-b border-border glass sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between">
          {/* Лого */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-sm">
              <BarChart2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground tracking-tight leading-none">Sales Compass</h1>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {isCeo ? 'CEO стратегический дашборд' : isAdmin ? 'Панель администратора' : 'Панель менеджера'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Период */}
            <Select value={globalPeriod} onValueChange={(v) => setGlobalPeriod(v as typeof globalPeriod)}>
              <SelectTrigger className="h-8 text-xs w-28 border-border/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Месяц</SelectItem>
                <SelectItem value="quarter">Квартал</SelectItem>
                <SelectItem value="year">Год</SelectItem>
              </SelectContent>
            </Select>

            {/* Переключатель темы */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="h-8 w-8 p-0 hover:bg-muted/60"
              title={isDark ? 'Светлая тема' : 'Тёмная тема'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {/* Бейдж роли */}
            <Badge
              variant={isAdmin || isCeo ? 'default' : 'secondary'}
              className={`text-xs font-semibold ${
                isCeo ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-white border-0 shadow-sm' : ''
              }`}
            >
              {isCeo
                ? <><Crown className="w-3 h-3 mr-1" />CEO</>
                : isAdmin
                  ? <><Shield className="w-3 h-3 mr-1" />Админ</>
                  : <><User className="w-3 h-3 mr-1" />Менеджер</>
              }
            </Badge>

            <span className="text-xs text-muted-foreground hidden sm:block max-w-[120px] truncate">
              {profile?.full_name || profile?.email}
            </span>

            {/* Экспорт */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs h-8 border-border/60">
                  <Download className="w-3.5 h-3.5 mr-1.5" />Экспорт
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="text-xs">
                <DropdownMenuItem onClick={handlePdfExport}>
                  <FileText className="w-3.5 h-3.5 mr-2" />Дашборд (PDF)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExcelExport}>
                  <Download className="w-3.5 h-3.5 mr-2" />Менеджеры (Excel)
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleExport('csv')}>Продукты (CSV)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('json')}>Продукты (JSON)</DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportStats}>Статистика (CSV)</DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportCrossSales}>Кросс-продажи (CSV)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {isAdmin && (
              <Button variant="outline" size="sm" onClick={() => setShowAdmin(!showAdmin)} className="text-xs h-8 border-border/60">
                <Shield className="w-3.5 h-3.5 mr-1" />
                {showAdmin ? 'Скрыть' : 'Польз.'}
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={signOut} className="h-8 w-8 p-0 hover:bg-red-500/10 hover:text-red-500">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* ─── Main content ────────────────────────────────────────────────── */}
      <div id="ceo-dashboard" className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">
        {isAdmin && showAdmin && <AdminPanel />}

        {dataError && (
          <ErrorState
            title="Ошибка загрузки данных"
            description={dataError}
            onRetry={handleRefresh}
            onHome={() => window.location.reload()}
          />
        )}

        {!dataError && (
          <>
            {!isAdmin && (profile?.region || profile?.category) && (
              <div className="rounded-lg border border-border bg-card p-3 text-xs text-muted-foreground">
                Доступ ограничен: {profile?.region && `регион — ${profile.region}`}
                {profile?.region && profile?.category && ', '}
                {profile?.category && `категория — ${profile.category}`}
              </div>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="h-9">
                {visibleTabs.includes('executive') && (
                  <TabsTrigger value="executive" className="text-xs gap-1.5">
                    <BarChart2 className="w-3.5 h-3.5" />Executive Summary
                  </TabsTrigger>
                )}
                {visibleTabs.includes('finance') && (
                  <TabsTrigger value="finance" className="text-xs gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />Финансы
                  </TabsTrigger>
                )}
                {visibleTabs.includes('sales') && (
                  <TabsTrigger value="sales" className="text-xs gap-1.5">
                    <Users className="w-3.5 h-3.5" />Продажи
                  </TabsTrigger>
                )}
                {visibleTabs.includes('marketing') && (
                  <TabsTrigger value="marketing" className="text-xs gap-1.5">
                    <Megaphone className="w-3.5 h-3.5" />Маркетинг
                  </TabsTrigger>
                )}
                {visibleTabs.includes('dev') && (
                  <TabsTrigger value="dev" className="text-xs gap-1.5">
                    <Code2 className="w-3.5 h-3.5" />Разработка
                  </TabsTrigger>
                )}
              </TabsList>

              {/* ══ EXECUTIVE SUMMARY ══ */}
              <TabsContent value="executive" className="mt-5 space-y-6">
                <p className="text-xs text-muted-foreground">
                  Период: <span className="font-medium text-foreground">{periodLabels[globalPeriod]}</span>
                  {' · '}Карточки KPI кликабельны для детализации
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  <KpiCard label="Общая выручка"       value={`${(kpi.revenue.current / 1_000_000).toFixed(1)}M`}  unit="KGS" change={kpi.revenue.change}    icon={TrendingUp}   iconColor="text-primary"       onClick={() => setDetailType('revenue')} />
                  <KpiCard label="Закрытых сделок"     value={String(kpi.deals.current)}                           change={kpi.deals.change}                  icon={ShoppingCart} iconColor="text-chart-2"       onClick={() => setDetailType('deals')} />
                  <KpiCard label="Средний чек"         value={`${(kpi.avgCheck.current / 1000).toFixed(0)}K`}      unit="KGS" change={kpi.avgCheck.change}     icon={Receipt}      iconColor="text-chart-3"       onClick={() => setDetailType('avgCheck')} />
                  <KpiCard label="Маржинальность"      value={`${kpi.margin.current}`}                             unit="%"   change={kpi.margin.change}        icon={Percent}      iconColor="text-emerald-500"   onClick={() => setDetailType('margin')} />
                  <KpiCard label="Лиды"                value={String(kpi.leads.current)}                           change={kpi.leads.change}                  icon={Target}       iconColor="text-blue-500"      onClick={() => setDetailType('leads')} />
                  <KpiCard label="Конверсия"           value={`${kpi.conversion.current}`}                         unit="%"   change={kpi.conversion.change}    icon={BarChart2}    iconColor="text-chart-4"       onClick={() => setDetailType('conversion')} />
                  <KpiCard label="Расходы на рекламу"  value={`${(kpi.adSpend.current / 1_000_000).toFixed(2)}M`} unit="KGS" change={kpi.adSpend.change}       icon={Megaphone}    iconColor="text-amber-500"     invertTrend onClick={() => setDetailType('adSpend')} />
                  <KpiCard label="Активных проектов"   value={String(devProjects.filter((p) => p.status === 'active').length)} change={0} icon={Code2} iconColor="text-violet-500" detail={`${devProjects.filter((p) => p.status === 'at_risk').length} под риском`} />
                </div>

                {(devProjects.some((p) => p.status === 'overdue') || stuckDeals.length > 0) && (
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <h3 className="text-sm font-semibold text-foreground">Требует внимания</h3>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3 text-xs">
                      {devProjects.filter((p) => p.status === 'overdue').map((p) => (
                        <div key={p.id} className="flex justify-between rounded-lg bg-card border border-border px-3 py-2">
                          <span className="text-muted-foreground">Просрочен: <span className="text-foreground font-medium">{p.name}</span></span>
                          <span className="text-red-500 font-semibold">+{Math.abs(p.daysLeft)} дн.</span>
                        </div>
                      ))}
                      {stuckDeals.slice(0, 2).map((d) => (
                        <div key={d.id} className="flex justify-between rounded-lg bg-card border border-border px-3 py-2">
                          <span className="text-muted-foreground">Зависла: <span className="text-foreground font-medium">{d.clientName}</span></span>
                          <span className="text-amber-500 font-semibold">{d.daysSinceLastActivity} дн.</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <PlanFactChart />
                  <SalesFunnel />
                </div>
              </TabsContent>

              {/* ══ ФИНАНСЫ ══ */}
              <TabsContent value="finance" className="mt-5 space-y-5">
                <FilterPanel filters={filters} onFiltersChange={setFilters} onRefresh={handleRefresh} />
                <StatsCards products={reportProducts} />
                {sortedProducts.length === 0 ? (
                  <NoResultsState onReset={() => setFilters({ period: 'month', categories: [], regions: [], clientTypes: [], dateRange: { startDate: null, endDate: null } })} title="Нет данных" description="По вашим фильтрам не найдено данных." />
                ) : (
                  <>
                    <PlanFactChart />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <RevenueChart products={reportProducts} />
                      <DealsChart products={reportProducts} />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <AvgCheckChart products={reportProducts} />
                      <CrossSalesHeatmap crossSales={crossSales} productNames={productNames} />
                    </div>
                  </>
                )}
              </TabsContent>

              {/* ══ ПРОДАЖИ ══ */}
              <TabsContent value="sales" className="mt-5 space-y-5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <KpiCard label="Выручка отдела"  value={`${(kpi.revenue.current / 1_000_000).toFixed(1)}M`} unit="KGS" change={kpi.revenue.change}    icon={TrendingUp}   iconColor="text-primary"      onClick={() => setDetailType('revenue')} />
                  <KpiCard label="Закрытых сделок" value={String(kpi.deals.current)}                          change={kpi.deals.change}                  icon={ShoppingCart} iconColor="text-chart-2"      onClick={() => setDetailType('deals')} />
                  <KpiCard label="Средний чек"     value={`${(kpi.avgCheck.current / 1000).toFixed(0)}K`}    unit="KGS" change={kpi.avgCheck.change}     icon={Receipt}      iconColor="text-chart-3"      onClick={() => setDetailType('avgCheck')} />
                  <KpiCard label="Конверсия"       value={`${kpi.conversion.current}%`}                      change={kpi.conversion.change}              icon={BarChart2}    iconColor="text-emerald-500"  onClick={() => setDetailType('conversion')} />
                </div>

                <FilterPanel filters={filters} onFiltersChange={setFilters} onRefresh={handleRefresh} />

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-foreground">
                      Продукты {!showAllCards && reportProducts.length > 5 && `(Топ 5 из ${reportProducts.length})`}
                    </h2>
                    <div className="flex items-center gap-1">
                      {sortOptions.map((opt) => (
                        <button key={opt.key} onClick={() => setSortBy(opt.key)}
                          className={`px-2 py-1 rounded text-xs font-medium transition-colors ${sortBy === opt.key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {sortedProducts.length === 0 ? (
                    <NoResultsState onReset={() => setFilters({ period: 'month', categories: [], regions: [], clientTypes: [], dateRange: { startDate: null, endDate: null } })} title="Нет данных" description="По вашим текущим фильтрам не найдено продуктов." />
                  ) : (
                    <div>
                      <div className="dashboard-grid">
                        {displayedProducts.map((product) => (
                          <ProductCard key={product.id} product={product} totalRevenue={totalRevenue} onClick={setSelectedProduct} />
                        ))}
                      </div>
                      {reportProducts.length > 5 && (
                        <div className="flex justify-center mt-4">
                          <Button variant={showAllCards ? 'default' : 'outline'} size="sm" onClick={() => setShowAllCards(!showAllCards)} className="text-xs">
                            {showAllCards ? 'Показать топ 5' : `Показать все (${reportProducts.length})`}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <ManagersTable />
                  <SalesFunnel />
                </div>

                <div className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <h3 className="text-sm font-semibold text-foreground">Зависшие сделки</h3>
                    </div>
                    <span className="text-xs text-muted-foreground">{stuckDeals.length} сделок без активности</span>
                  </div>
                  <div className="space-y-2">
                    {stuckDeals.map((d) => (
                      <div key={d.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5 text-xs hover:bg-muted/20 transition-colors">
                        <div>
                          <p className="font-medium text-foreground">{d.clientName}</p>
                          <p className="text-muted-foreground">{d.manager} · этап: {d.stage}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono font-semibold text-foreground">{(d.amount / 1000).toFixed(0)}K KGS</p>
                          <p className={`font-medium ${d.daysSinceLastActivity >= 21 ? 'text-red-500' : 'text-amber-500'}`}>
                            {d.daysSinceLastActivity} дн. простоя
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* ══ МАРКЕТИНГ ══ */}
              <TabsContent value="marketing" className="mt-5 space-y-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <KpiCard label="Лиды"              value={String(kpi.leads.current)}                            change={kpi.leads.change}    icon={Target}    iconColor="text-blue-500"    onClick={() => setDetailType('leads')} />
                  <KpiCard label="Расходы на рекл."  value={`${(kpi.adSpend.current / 1_000_000).toFixed(2)}M`} unit="KGS" change={kpi.adSpend.change} invertTrend icon={Megaphone} iconColor="text-amber-500" onClick={() => setDetailType('adSpend')} />
                  <KpiCard label="Конв. лид→сделка"  value={`${kpi.conversion.current}%`}                        change={kpi.conversion.change} icon={BarChart2} iconColor="text-emerald-500" onClick={() => setDetailType('conversion')} />
                </div>
                <MarketingROI />
              </TabsContent>

              {/* ══ РАЗРАБОТКА ══ */}
              <TabsContent value="dev" className="mt-5">
                <DevProjects />
              </TabsContent>
            </Tabs>

            <DetailModal type={detailType} onClose={() => setDetailType(null)} />
            <ProductDetailModal product={selectedProduct} open={!!selectedProduct} onClose={() => setSelectedProduct(null)} />
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
