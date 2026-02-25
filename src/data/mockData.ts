// ─── Менеджеры (отдел продаж) ───────────────────────────────────────────────
export interface Manager {
    id: string;
    name: string;
    revenue: number;
    deals: number;
    avgCheck: number;
    conversion: number; // %
    avgCycleDays: number; // средний цикл сделки
}

// ─── Воронка продаж ──────────────────────────────────────────────────────────
export interface FunnelStage {
    stage: string;
    count: number;
    color: string;
}

// ─── Маркетинговые каналы ────────────────────────────────────────────────────
export interface MarketingChannel {
    channel: string;
    leads: number;
    spend: number;       // расходы в KGS
    revenue: number;     // выручка в KGS
    roi: number;         // (revenue - spend) / spend * 100
    conversion: number;  // лид → сделка %
    costPerLead: number; // spend / leads
}

// ─── Проекты разработки ──────────────────────────────────────────────────────
export interface DevProject {
    id: string;
    name: string;
    status: 'active' | 'completed' | 'overdue' | 'at_risk';
    deadline: string;
    daysLeft: number;
    teamLoad: number;    // загрузка команды %
    tasksInProgress: number;
    overBudget: boolean;
}

// ─── Плановые vs фактические данные ─────────────────────────────────────────
export interface MonthlyPlanFact {
    month: string;
    plan: number;
    fact: number;
    fulfillment: number; // fact / plan * 100
}

// ─── Зависшие сделки ─────────────────────────────────────────────────────────
export interface StuckDeal {
    id: string;
    clientName: string;
    amount: number;
    daysSinceLastActivity: number;
    manager: string;
    stage: string;
}

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

export interface Deal {
    id: string;
    date: string;
    amount: number;
    clientName: string;
    clientType: 'B2B' | 'B2C' | 'VIP';
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
    dateRange: {
        startDate: string | null;
        endDate: string | null;
    };
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

// 🔴 ФЛАГ ДЛЯ ТЕСТИРОВАНИЯ ОШИБОК
// Измените на true чтобы симулировать ошибку загрузки данных
export const SIMULATE_DATA_ERROR = false;

// Test accounts for different roles
export const testAccounts = {
    ceo: {
        email: 'ceo@example.com',
        password: 'ceo123',
        fullName: 'Генеральный Директор',
        description: 'Стратегический дашборд: все 5 вкладок, все данные'
    },
    admin: {
        email: 'admin@example.com',
        password: 'admin123',
        fullName: 'Администратор Системы',
        description: 'Полный доступ ко всем данным и функциям'
    },
    manager_bishkek: {
        email: 'manager.bishkek@example.com',
        password: 'manager123',
        fullName: 'Менеджер Бишкек',
        description: 'Доступ только к данным Бишкека'
    },
    manager_osh: {
        email: 'manager.osh@example.com',
        password: 'manager123',
        fullName: 'Менеджер Ош',
        description: 'Доступ только к данным Ош'
    },
    manager_crm: {
        email: 'manager.crm@example.com',
        password: 'manager123',
        fullName: 'Менеджер CRM',
        description: 'Доступ только к CRM-системам'
    },
};

export const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

// Full product catalog for ADMIN
export const products: Product[] = [
    // Бишкек - CRM-системы (B2B)
    {
        id: '1', name: 'Управо Софт Премиум', category: 'CRM-системы', revenue: 4587320, deals: 127,
        avgCheck: 36120.63, region: 'Бишкек', clientType: 'B2B',
        monthlyRevenue: months.map((m, i) => ({ month: m, revenue: 300000 + Math.random() * 200000, deals: 8 + Math.floor(Math.random() * 10) })),
    },
    // Бишкек - Аналитика (B2B, VIP)
    {
        id: '2', name: 'Аналитика Про', category: 'Аналитика', revenue: 3214780, deals: 89,
        avgCheck: 36120.00, region: 'Бишкек', clientType: 'B2B',
        monthlyRevenue: months.map((m) => ({ month: m, revenue: 200000 + Math.random() * 150000, deals: 5 + Math.floor(Math.random() * 8) })),
    },
    // Ош - Маркетинг (B2C)
    {
        id: '3', name: 'Маркет Пакет', category: 'Маркетинг', revenue: 2876450, deals: 203,
        avgCheck: 14169.21, region: 'Ош', clientType: 'B2C',
        monthlyRevenue: months.map((m) => ({ month: m, revenue: 180000 + Math.random() * 120000, deals: 12 + Math.floor(Math.random() * 15) })),
    },
    // Джалал-Абад - Поддержка (B2B)
    {
        id: '4', name: 'Суппорт Стол', category: 'Поддержка', revenue: 1945600, deals: 156,
        avgCheck: 12472.82, region: 'Джалал-Абад', clientType: 'B2B',
        monthlyRevenue: months.map((m) => ({ month: m, revenue: 120000 + Math.random() * 100000, deals: 10 + Math.floor(Math.random() * 12) })),
    },
    // Каракол - Обучение (B2C)
    {
        id: '5', name: 'Обучаем Платформа', category: 'Обучение', revenue: 1678900, deals: 312,
        avgCheck: 5381.09, region: 'Каракол', clientType: 'B2C',
        monthlyRevenue: months.map((m) => ({ month: m, revenue: 100000 + Math.random() * 80000, deals: 20 + Math.floor(Math.random() * 20) })),
    },
    // Бишкек - Интеграции (VIP)
    {
        id: '6', name: 'Порталь Про', category: 'Интеграции', revenue: 2345000, deals: 67,
        avgCheck: 35000.00, region: 'Бишкек', clientType: 'VIP',
        monthlyRevenue: months.map((m) => ({ month: m, revenue: 150000 + Math.random() * 130000, deals: 3 + Math.floor(Math.random() * 6) })),
    },
    // Нарын - CRM-системы (B2C)
    {
        id: '7', name: 'Управо Софт Лайт', category: 'CRM-системы', revenue: 987650, deals: 245,
        avgCheck: 4031.43, region: 'Нарын', clientType: 'B2C',
        monthlyRevenue: months.map((m) => ({ month: m, revenue: 60000 + Math.random() * 50000, deals: 15 + Math.floor(Math.random() * 18) })),
    },
    // Бишкек - Аналитика (VIP)
    {
        id: '8', name: 'Дашборд Данных', category: 'Аналитика', revenue: 3890200, deals: 78,
        avgCheck: 49874.36, region: 'Бишкек', clientType: 'VIP',
        monthlyRevenue: months.map((m) => ({ month: m, revenue: 250000 + Math.random() * 180000, deals: 4 + Math.floor(Math.random() * 7) })),
    },
    // Ош - Интеграции (B2B)
    {
        id: '9', name: 'Хаб Интеграции', category: 'Интеграции', revenue: 1567890, deals: 43,
        avgCheck: 36462.09, region: 'Ош', clientType: 'B2B',
        monthlyRevenue: months.map((m) => ({ month: m, revenue: 90000 + Math.random() * 70000, deals: 2 + Math.floor(Math.random() * 5) })),
    },
    // Бишкек - Маркетинг (B2B)
    {
        id: '10', name: 'Авто Маркет', category: 'Маркетинг', revenue: 2345670, deals: 156,
        avgCheck: 15036.35, region: 'Бишкек', clientType: 'B2B',
        monthlyRevenue: months.map((m) => ({ month: m, revenue: 140000 + Math.random() * 100000, deals: 9 + Math.floor(Math.random() * 12) })),
    },
    // Талас - Поддержка (B2C)
    {
        id: '11', name: 'Суппорт Лайт', category: 'Поддержка', revenue: 876543, deals: 287,
        avgCheck: 3054.99, region: 'Талас', clientType: 'B2C',
        monthlyRevenue: months.map((m) => ({ month: m, revenue: 50000 + Math.random() * 40000, deals: 18 + Math.floor(Math.random() * 22) })),
    },
    // Каракол - Аналитика (B2C)
    {
        id: '12', name: 'Аналитика Лайт', category: 'Аналитика', revenue: 1234567, deals: 234,
        avgCheck: 5275.37, region: 'Каракол', clientType: 'B2C',
        monthlyRevenue: months.map((m) => ({ month: m, revenue: 70000 + Math.random() * 60000, deals: 14 + Math.floor(Math.random() * 18) })),
    },
];

export const crossSales: CrossSale[] = [
    // Бишкек паттерны
    { product1: 'Управо Софт Премиум', product2: 'Аналитика Про', count: 45 },
    { product1: 'Управо Софт Премиум', product2: 'Порталь Про', count: 29 },
    { product1: 'Управо Софт Премиум', product2: 'Авто Маркет', count: 34 },
    { product1: 'Аналитика Про', product2: 'Дашборд Данных', count: 52 },
    { product1: 'Порталь Про', product2: 'Дашборд Данных', count: 33 },
    { product1: 'Порталь Про', product2: 'Аналитика Про', count: 28 },
    // Ош паттерны
    { product1: 'Маркет Пакет', product2: 'Хаб Интеграции', count: 27 },
    { product1: 'Хаб Интеграции', product2: 'Маркет Пакет', count: 19 },
    // Кросс-региональные
    { product1: 'Управо Софт Премиум', product2: 'Суппорт Стол', count: 38 },
    { product1: 'Маркет Пакет', product2: 'Обучаем Платформа', count: 23 },
    { product1: 'Суппорт Стол', product2: 'Управо Софт Лайт', count: 41 },
    { product1: 'Управо Софт Лайт', product2: 'Обучаем Платформа', count: 22 },
    { product1: 'Обучаем Платформа', product2: 'Суппорт Лайт', count: 18 },
    { product1: 'Аналитика Лайт', product2: 'Обучаем Платформа', count: 16 },
];

/**
 * Генерирует список сделок для продукта
 */
export function generateDealsForProduct(productId: string, productName: string, dealCount: number): Deal[] {
    const deals: Deal[] = [];
    const clientNames = [
        'ООО Бишкек Tech', 'АО Кыргызстан IT', 'ТОО Логистика Plus',
        'АО Энергия Центр', 'ТОО Строй Проект', 'ООО Маркет Плюс',
        'АО Финанс Групп', 'ТОО Консалт Pro', 'ООО Дизайн Studio',
        'АО Решения Будущего', 'ТОО Сервис Экспресс', 'ООО Цифра Сум',
    ];

    for (let i = 0; i < Math.min(dealCount, 15); i++) {
        const daysAgo = Math.floor(Math.random() * 60);
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);

        deals.push({
            id: `deal-${productId}-${i}`,
            date: date.toLocaleDateString('ru-RU'),
            amount: Math.floor(Math.random() * 500000) + 100000,
            clientName: clientNames[Math.floor(Math.random() * clientNames.length)],
            clientType: ['B2B', 'B2C', 'VIP'][Math.floor(Math.random() * 3)] as 'B2B' | 'B2C' | 'VIP',
        });
    }

    return deals.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function formatCurrency(value: number): string {
    return value.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, '.').replace(/\s/g, ' ') + ' KGS';
}

export function formatNumber(value: number): string {
    return value.toLocaleString('ru-RU').replace(/\s/g, ' ');
}

// ─── Топ-менеджеры по продажам ───────────────────────────────────────────────
export const managers: Manager[] = [
    { id: 'm1', name: 'Айгерим Сатарова', revenue: 3_450_000, deals: 78, avgCheck: 44_230, conversion: 68, avgCycleDays: 12 },
    { id: 'm2', name: 'Дамир Болотбеков', revenue: 2_980_000, deals: 65, avgCheck: 45_846, conversion: 61, avgCycleDays: 15 },
    { id: 'm3', name: 'Нурбек Алиев', revenue: 2_640_000, deals: 91, avgCheck: 29_011, conversion: 72, avgCycleDays: 9 },
    { id: 'm4', name: 'Зарина Исакова', revenue: 2_210_000, deals: 54, avgCheck: 40_926, conversion: 55, avgCycleDays: 18 },
    { id: 'm5', name: 'Эркин Жумабеков', revenue: 1_870_000, deals: 83, avgCheck: 22_530, conversion: 79, avgCycleDays: 8 },
    { id: 'm6', name: 'Гульмира Токтомат', revenue: 1_620_000, deals: 47, avgCheck: 34_468, conversion: 58, avgCycleDays: 14 },
];

// ─── Воронка продаж ──────────────────────────────────────────────────────────
export const salesFunnel: FunnelStage[] = [
    { stage: 'Лиды', count: 1240, color: 'hsl(217, 91%, 60%)' },
    { stage: 'Квалификация', count: 892, color: 'hsl(217, 91%, 65%)' },
    { stage: 'Предложение', count: 534, color: 'hsl(217, 91%, 70%)' },
    { stage: 'Переговоры', count: 318, color: 'hsl(217, 91%, 75%)' },
    { stage: 'Закрытие', count: 418, color: 'hsl(217, 91%, 80%)' },
];

// ─── Зависшие сделки ─────────────────────────────────────────────────────────
export const stuckDeals: StuckDeal[] = [
    { id: 'sd1', clientName: 'ООО Техно Центр', amount: 780_000, daysSinceLastActivity: 21, manager: 'Дамир Болотбеков', stage: 'Переговоры' },
    { id: 'sd2', clientName: 'АО Бишкек Строй', amount: 450_000, daysSinceLastActivity: 18, manager: 'Зарина Исакова', stage: 'Предложение' },
    { id: 'sd3', clientName: 'ТОО Агро Плюс', amount: 330_000, daysSinceLastActivity: 15, manager: 'Айгерим Сатарова', stage: 'Квалификация' },
    { id: 'sd4', clientName: 'АО Медиа Групп', amount: 920_000, daysSinceLastActivity: 25, manager: 'Нурбек Алиев', stage: 'Переговоры' },
    { id: 'sd5', clientName: 'ООО Логистик Юг', amount: 210_000, daysSinceLastActivity: 30, manager: 'Эркин Жумабеков', stage: 'Закрытие' },
];

// ─── Маркетинговые каналы ────────────────────────────────────────────────────
export const marketingChannels: MarketingChannel[] = [
    { channel: 'Google Ads', leads: 430, spend: 520_000, revenue: 2_340_000, roi: 350, conversion: 34, costPerLead: 1_209 },
    { channel: 'Facebook Ads', leads: 310, spend: 380_000, revenue: 1_560_000, roi: 311, conversion: 28, costPerLead: 1_226 },
    { channel: 'SEO', leads: 280, spend: 120_000, revenue: 1_890_000, roi: 1475, conversion: 42, costPerLead: 429 },
    { channel: 'Email', leads: 195, spend: 45_000, revenue: 870_000, roi: 1833, conversion: 38, costPerLead: 231 },
    { channel: 'Партнеры', leads: 150, spend: 230_000, revenue: 1_120_000, roi: 387, conversion: 45, costPerLead: 1_533 },
    { channel: 'Холодные', leads: 210, spend: 290_000, revenue: 780_000, roi: 169, conversion: 18, costPerLead: 1_381 },
];

// ─── Проекты разработки ──────────────────────────────────────────────────────
export const devProjects: DevProject[] = [
    { id: 'dp1', name: 'CRM 3.0 Migration', status: 'active', deadline: '2026-04-15', daysLeft: 49, teamLoad: 87, tasksInProgress: 14, overBudget: false },
    { id: 'dp2', name: 'API Интеграция Bitrix', status: 'at_risk', deadline: '2026-03-05', daysLeft: 8, teamLoad: 95, tasksInProgress: 21, overBudget: true },
    { id: 'dp3', name: 'Мобильное приложение', status: 'active', deadline: '2026-05-30', daysLeft: 94, teamLoad: 72, tasksInProgress: 9, overBudget: false },
    { id: 'dp4', name: 'Аналитика v2', status: 'overdue', deadline: '2026-01-31', daysLeft: -25, teamLoad: 60, tasksInProgress: 6, overBudget: true },
    { id: 'dp5', name: 'Онбординг клиентов', status: 'completed', deadline: '2026-02-10', daysLeft: 0, teamLoad: 0, tasksInProgress: 0, overBudget: false },
    { id: 'dp6', name: 'Дашборд CEO', status: 'active', deadline: '2026-03-20', daysLeft: 23, teamLoad: 80, tasksInProgress: 11, overBudget: false },
    { id: 'dp7', name: 'SSO Авторизация', status: 'at_risk', deadline: '2026-03-10', daysLeft: 13, teamLoad: 91, tasksInProgress: 17, overBudget: false },
    { id: 'dp8', name: 'ERP Интеграция', status: 'completed', deadline: '2026-01-20', daysLeft: 0, teamLoad: 0, tasksInProgress: 0, overBudget: true },
];

// ─── Плановые vs фактические данные ─────────────────────────────────────────
export const monthlyPlanFact: MonthlyPlanFact[] = [
    { month: 'Янв', plan: 3_500_000, fact: 3_210_000, fulfillment: 91.7 },
    { month: 'Фев', plan: 3_700_000, fact: 4_050_000, fulfillment: 109.5 },
    { month: 'Мар', plan: 4_000_000, fact: 3_780_000, fulfillment: 94.5 },
    { month: 'Апр', plan: 4_200_000, fact: 4_560_000, fulfillment: 108.6 },
    { month: 'Май', plan: 4_500_000, fact: 4_320_000, fulfillment: 96.0 },
    { month: 'Июн', plan: 4_800_000, fact: 5_100_000, fulfillment: 106.3 },
    { month: 'Июл', plan: 4_600_000, fact: 4_230_000, fulfillment: 91.9 },
    { month: 'Авг', plan: 4_700_000, fact: 4_980_000, fulfillment: 105.9 },
    { month: 'Сен', plan: 5_000_000, fact: 5_340_000, fulfillment: 106.8 },
    { month: 'Окт', plan: 5_200_000, fact: 4_890_000, fulfillment: 94.0 },
    { month: 'Ноя', plan: 5_500_000, fact: 5_870_000, fulfillment: 106.7 },
    { month: 'Дек', plan: 6_000_000, fact: 6_450_000, fulfillment: 107.5 },
];

// ─── KPI данные (текущий период vs предыдущий) ───────────────────────────────
export const kpiData = {
    totalRevenue: { current: 57_780_000, previous: 51_200_000 },
    closedDeals: { current: 418, previous: 382 },
    avgCheck: { current: 138_230, previous: 134_010 },
    grossMargin: { current: 34.2, previous: 31.8 },   // %
    leads: { current: 1_575, previous: 1_380 },
    conversionRate: { current: 26.5, previous: 27.7 },   // %
    adSpend: { current: 1_585_000, previous: 1_420_000 },
};

/** Рассчитывает % изменения */
export function calcChange(current: number, previous: number): number {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
}
