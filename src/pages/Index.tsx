import { useState, useMemo, useCallback } from 'react';
import { products as allProducts, crossSales, type Filters, type Product } from '@/data/mockData';
import { FilterPanel } from '@/components/dashboard/FilterPanel';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { ProductCard } from '@/components/dashboard/ProductCard';
import { ProductDetailModal } from '@/components/dashboard/ProductDetailModal';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { DealsChart } from '@/components/dashboard/DealsChart';
import { AvgCheckChart } from '@/components/dashboard/AvgCheckChart';
import { CrossSalesHeatmap } from '@/components/dashboard/CrossSalesHeatmap';
import { AdminPanel } from '@/components/dashboard/AdminPanel';
import { useAuth } from '@/hooks/useAuth';
import { ArrowUpDown, LogOut, Shield, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type SortKey = 'revenue' | 'deals' | 'avgCheck';

const Index = () => {
  const { profile, role, isAdmin, signOut } = useAuth();

  const [filters, setFilters] = useState<Filters>({
    period: 'month',
    categories: [],
    regions: [],
    clientTypes: [],
  });
  const [sortBy, setSortBy] = useState<SortKey>('revenue');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);

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

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => b[sortBy] - a[sortBy]);
  }, [filteredProducts, sortBy]);

  const totalRevenue = useMemo(() => filteredProducts.reduce((s, p) => s + p.revenue, 0), [filteredProducts]);
  const productNames = useMemo(() => filteredProducts.map((p) => p.name), [filteredProducts]);

  const handleRefresh = useCallback(() => {}, []);

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
        <StatsCards products={filteredProducts} />

        {/* Product Cards */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">Продукты</h2>
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
            <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground text-sm">
              Нет данных
            </div>
          ) : (
            <div className="dashboard-grid">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  totalRevenue={totalRevenue}
                  onClick={setSelectedProduct}
                />
              ))}
            </div>
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-4">
          <RevenueChart products={filteredProducts} />
          <DealsChart products={filteredProducts} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <AvgCheckChart products={filteredProducts} />
          <CrossSalesHeatmap crossSales={crossSales} productNames={productNames} />
        </div>

        {/* Modal */}
        <ProductDetailModal
          product={selectedProduct}
          open={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      </div>
    </div>
  );
};

export default Index;
