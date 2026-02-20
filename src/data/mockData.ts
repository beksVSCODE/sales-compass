export interface Product {
  id: string;
  name: string;
  category: string;
  revenue: number;
  deals: number;
  avgCheck: number;
  region: string;
  clientType: 'B2B' | 'B2C' | 'VIP';
  monthlyRevenue: { month: string; revenue: number; deals: number }[];
}

export interface CrossSale {
  product1: string;
  product2: string;
  count: number;
}

export interface Filters {
  period: string;
  categories: string[];
  regions: string[];
  clientTypes: string[];
}

export const categories = ['CRM-системы', 'Аналитика', 'Маркетинг', 'Поддержка', 'Обучение', 'Интеграции'];
export const regions = ['Бишкек', 'Ош', 'Джалал-Абад', 'Каракол', 'Нарын', 'Талас'];
export const clientTypes: ('B2B' | 'B2C' | 'VIP')[] = ['B2B', 'B2C', 'VIP'];
export const periods = [
  { value: 'day', label: 'День' },
  { value: 'week', label: 'Неделя' },
  { value: 'month', label: 'Месяц' },
  { value: 'quarter', label: 'Квартал' },
  { value: 'year', label: 'Год' },
];

const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

export const products: Product[] = [
  {
    id: '1', name: 'CRM Enterprise', category: 'CRM-системы', revenue: 4587320, deals: 127,
    avgCheck: 36120.63, region: 'Бишкек', clientType: 'B2B',
    monthlyRevenue: months.map((m, i) => ({ month: m, revenue: 300000 + Math.random() * 200000, deals: 8 + Math.floor(Math.random() * 10) })),
  },
  {
    id: '2', name: 'Analytics Pro', category: 'Аналитика', revenue: 3214780, deals: 89,
    avgCheck: 36120.00, region: 'Бишкек', clientType: 'B2B',
    monthlyRevenue: months.map((m) => ({ month: m, revenue: 200000 + Math.random() * 150000, deals: 5 + Math.floor(Math.random() * 8) })),
  },
  {
    id: '3', name: 'Marketing Suite', category: 'Маркетинг', revenue: 2876450, deals: 203,
    avgCheck: 14169.21, region: 'Ош', clientType: 'B2C',
    monthlyRevenue: months.map((m) => ({ month: m, revenue: 180000 + Math.random() * 120000, deals: 12 + Math.floor(Math.random() * 15) })),
  },
  {
    id: '4', name: 'Support Desk', category: 'Поддержка', revenue: 1945600, deals: 156,
    avgCheck: 12472.82, region: 'Джалал-Абад', clientType: 'B2B',
    monthlyRevenue: months.map((m) => ({ month: m, revenue: 120000 + Math.random() * 100000, deals: 10 + Math.floor(Math.random() * 12) })),
  },
  {
    id: '5', name: 'LearnPlatform', category: 'Обучение', revenue: 1678900, deals: 312,
    avgCheck: 5381.09, region: 'Каракол', clientType: 'B2C',
    monthlyRevenue: months.map((m) => ({ month: m, revenue: 100000 + Math.random() * 80000, deals: 20 + Math.floor(Math.random() * 20) })),
  },
  {
    id: '6', name: 'API Gateway', category: 'Интеграции', revenue: 2345000, deals: 67,
    avgCheck: 35000.00, region: 'Бишкек', clientType: 'VIP',
    monthlyRevenue: months.map((m) => ({ month: m, revenue: 150000 + Math.random() * 130000, deals: 3 + Math.floor(Math.random() * 6) })),
  },
  {
    id: '7', name: 'CRM Lite', category: 'CRM-системы', revenue: 987650, deals: 245,
    avgCheck: 4031.43, region: 'Нарын', clientType: 'B2C',
    monthlyRevenue: months.map((m) => ({ month: m, revenue: 60000 + Math.random() * 50000, deals: 15 + Math.floor(Math.random() * 18) })),
  },
  {
    id: '8', name: 'BI Dashboard', category: 'Аналитика', revenue: 3890200, deals: 78,
    avgCheck: 49874.36, region: 'Бишкек', clientType: 'VIP',
    monthlyRevenue: months.map((m) => ({ month: m, revenue: 250000 + Math.random() * 180000, deals: 4 + Math.floor(Math.random() * 7) })),
  },
];

export const crossSales: CrossSale[] = [
  { product1: 'CRM Enterprise', product2: 'Analytics Pro', count: 45 },
  { product1: 'CRM Enterprise', product2: 'Support Desk', count: 38 },
  { product1: 'CRM Enterprise', product2: 'API Gateway', count: 29 },
  { product1: 'Analytics Pro', product2: 'BI Dashboard', count: 52 },
  { product1: 'Analytics Pro', product2: 'Marketing Suite', count: 34 },
  { product1: 'Marketing Suite', product2: 'LearnPlatform', count: 27 },
  { product1: 'Support Desk', product2: 'CRM Lite', count: 41 },
  { product1: 'API Gateway', product2: 'BI Dashboard', count: 33 },
  { product1: 'CRM Lite', product2: 'LearnPlatform', count: 22 },
  { product1: 'Marketing Suite', product2: 'Support Desk', count: 19 },
  { product1: 'BI Dashboard', product2: 'CRM Enterprise', count: 36 },
  { product1: 'API Gateway', product2: 'Analytics Pro', count: 28 },
];

export function formatCurrency(value: number): string {
  return value.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, '.').replace(/\s/g, ' ') + ' KGS';
}

export function formatNumber(value: number): string {
  return value.toLocaleString('ru-RU').replace(/\s/g, ' ');
}
