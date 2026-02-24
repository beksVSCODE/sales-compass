import { useState, useMemo, useCallback } from 'react';
import { products as allProducts, crossSales, months, type Filters, type Product, SIMULATE_DATA_ERROR } from '@/data/mockData';
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
import { ErrorCard } from '@/components/dashboard/ErrorCard';
import { NoResultsState } from '@/components/dashboard/NoResultsState';
import { useAuth } from '@/hooks/useAuth';
import { ArrowUpDown, LogOut, Shield, User, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  exportProductsToCSV,
  exportProductsToJSON,
  exportStatsToCSV,
  exportCrossSalesToCSV,
  generateFilename,
} from '@/lib/export';
import { toast } from 'sonner';

type SortKey = 'revenue' | 'deals' | 'avgCheck';

const Index = () => {
  const { profile, role, isAdmin, signOut } = useAuth();

  const [filters, setFilters] = useState<Filters>({
    period: 'month',
    categories: [],
    regions: [],
    clientTypes: [],
    dateRange: { startDate: null, endDate: null },
  });
  const [sortBy, setSortBy] = useState<SortKey>('revenue');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAllCards, setShowAllCards] = useState(false);
  const [dataError, setDataError] = useState<string | null>(
    SIMULATE_DATA_ERROR ? 'Симуляция ошибки: Не удалось подключиться к серверу данных' : null
  );

  // Manager restrictions: filter by their assigned region/category
  const availableProducts = useMemo(() => {
    if (isAdmin) return allProducts;
    return allProducts.filter((p) => {
      if (profile?.region && p.region !== profile.region) return false;
      if (profile?.category && p.category !== profile.category) return false;
      return true;
    });
  }, [isAdmin, profile]);

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
    { key: 'revenue', label: 'Выручка' },
    { key: 'deals', label: 'Сделки' },
    { key: 'avgCheck', label: 'Средний чек' },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">Анализ продаж</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Дашборд аналитики продуктов и услуг</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Badge variant={isAdmin ? 'default' : 'secondary'} className="text-xs">
                {isAdmin ? <><Shield className="w-3 h-3 mr-1" />Админ</> : <><User className="w-3 h-3 mr-1" />Менеджер</>}
              </Badge>
              <span className="text-xs text-muted-foreground">{profile?.full_name || profile?.email}</span>
            </div>
            
            {/* Экспорт */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs">
                  <Download className="w-3.5 h-3.5 mr-1" />
                  Экспорт
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="text-xs">
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  Продукты (CSV)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('json')}>
                  Продукты (JSON)
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleExportStats}>
                  Статистика (CSV)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportCrossSales}>
                  Кросс-продажи (CSV)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {isAdmin && (
              <Button variant="outline" size="sm" onClick={() => setShowAdmin(!showAdmin)} className="text-xs">
                <Shield className="w-3.5 h-3.5 mr-1" />
                {showAdmin ? 'Скрыть панель' : 'Пользователи'}
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Admin Panel */}
        {isAdmin && showAdmin && <AdminPanel />}

        {/* Ошибка загрузки данных */}
        {dataError && (
          <ErrorState
            title="Ошибка загрузки данных"
            description={dataError}
            onRetry={handleRefresh}
            onHome={() => window.location.reload()}
          />
        )}

        {/* Если нет ошибки, показываем основной контент */}
        {!dataError && (
          <>
            {/* Manager restriction notice */}
            {!isAdmin && (profile?.region || profile?.category) && (
              <div className="rounded-lg border border-border bg-card p-3 text-xs text-muted-foreground">
                Доступ ограничен: {profile?.region && `регион — ${profile.region}`}
                {profile?.region && profile?.category && ', '}
                {profile?.category && `категория — ${profile.category}`}
              </div>
            )}

            {/* Filters */}
            <FilterPanel filters={filters} onFiltersChange={setFilters} onRefresh={handleRefresh} />

            {/* Stats */}
            <StatsCards products={reportProducts} />

            {/* Product Cards */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-foreground">
                  Продукты {!showAllCards && reportProducts.length > 5 && `(Топ 5 из ${reportProducts.length})`}
                </h2>
                <div className="flex items-center gap-1">
                  <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setSortBy(opt.key)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        sortBy === opt.key
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {sortedProducts.length === 0 ? (
                <NoResultsState 
                  onReset={() => setFilters({ period: 'month', categories: [], regions: [], clientTypes: [], dateRange: { startDate: null, endDate: null } })}
                  title="Нет данных"
                  description="По вашим текущим фильтрам не найдено продуктов. Попробуйте изменить параметры фильтра или сбросить фильтры."
                />
              ) : (
                <div>
                  <div className="dashboard-grid">
                  {displayedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      totalRevenue={totalRevenue}
                      onClick={setSelectedProduct}
                    />
                  ))}
                </div>
                
                {/* Show All button */}
                {reportProducts.length > 5 && (
                  <div className="flex justify-center mt-4">
                    <Button
                      variant={showAllCards ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setShowAllCards(!showAllCards)}
                      className="text-xs"
                    >
                      {showAllCards ? `Показать топ 5` : `Показать все (${reportProducts.length})`}
                    </Button>
                  </div>
                )}
                </div>
              )}
            </div>

            {/* Charts - только если есть данные */}
            {sortedProducts.length > 0 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <RevenueChart products={reportProducts} />
                  <DealsChart products={reportProducts} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <AvgCheckChart products={reportProducts} />
                  <CrossSalesHeatmap crossSales={crossSales} productNames={productNames} />
                </div>
              </>
            )}

            {/* Modal */}
            <ProductDetailModal
              product={selectedProduct}
              open={!!selectedProduct}
              onClose={() => setSelectedProduct(null)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
