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

const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

// Full product catalog for ADMIN
export const products: Product[] = [
    // Бишкек - CRM-системы (B2B)
    {
        id: '1', name: 'УправоСофт Премиум', category: 'CRM-системы', revenue: 4587320, deals: 127,
        avgCheck: 36120.63, region: 'Бишкек', clientType: 'B2B',
        monthlyRevenue: months.map((m, i) => ({ month: m, revenue: 300000 + Math.random() * 200000, deals: 8 + Math.floor(Math.random() * 10) })),
    },
    // Бишкек - Аналитика (B2B, VIP)
    {
        id: '2', name: 'АналитикаПро', category: 'Аналитика', revenue: 3214780, deals: 89,
        avgCheck: 36120.00, region: 'Бишкек', clientType: 'B2B',
        monthlyRevenue: months.map((m) => ({ month: m, revenue: 200000 + Math.random() * 150000, deals: 5 + Math.floor(Math.random() * 8) })),
    },
    // Ош - Маркетинг (B2C)
    {
        id: '3', name: 'МаркетПакет', category: 'Маркетинг', revenue: 2876450, deals: 203,
        avgCheck: 14169.21, region: 'Ош', clientType: 'B2C',
        monthlyRevenue: months.map((m) => ({ month: m, revenue: 180000 + Math.random() * 120000, deals: 12 + Math.floor(Math.random() * 15) })),
    },
    // Джалал-Абад - Поддержка (B2B)
    {
        id: '4', name: 'СуппортСтол', category: 'Поддержка', revenue: 1945600, deals: 156,
        avgCheck: 12472.82, region: 'Джалал-Абад', clientType: 'B2B',
        monthlyRevenue: months.map((m) => ({ month: m, revenue: 120000 + Math.random() * 100000, deals: 10 + Math.floor(Math.random() * 12) })),
    },
    // Каракол - Обучение (B2C)
    {
        id: '5', name: 'ОбучаемПлатформа', category: 'Обучение', revenue: 1678900, deals: 312,
        avgCheck: 5381.09, region: 'Каракол', clientType: 'B2C',
        monthlyRevenue: months.map((m) => ({ month: m, revenue: 100000 + Math.random() * 80000, deals: 20 + Math.floor(Math.random() * 20) })),
    },
    // Бишкек - Интеграции (VIP)
    {
        id: '6', name: 'ПортальПро', category: 'Интеграции', revenue: 2345000, deals: 67,
        avgCheck: 35000.00, region: 'Бишкек', clientType: 'VIP',
        monthlyRevenue: months.map((m) => ({ month: m, revenue: 150000 + Math.random() * 130000, deals: 3 + Math.floor(Math.random() * 6) })),
    },
    // Нарын - CRM-системы (B2C)
    {
        id: '7', name: 'УправоСофт Лайт', category: 'CRM-системы', revenue: 987650, deals: 245,
        avgCheck: 4031.43, region: 'Нарын', clientType: 'B2C',
        monthlyRevenue: months.map((m) => ({ month: m, revenue: 60000 + Math.random() * 50000, deals: 15 + Math.floor(Math.random() * 18) })),
    },
    // Бишкек - Аналитика (VIP)
    {
        id: '8', name: 'ДашбордДанных', category: 'Аналитика', revenue: 3890200, deals: 78,
        avgCheck: 49874.36, region: 'Бишкек', clientType: 'VIP',
        monthlyRevenue: months.map((m) => ({ month: m, revenue: 250000 + Math.random() * 180000, deals: 4 + Math.floor(Math.random() * 7) })),
    },
    // Ош - Интеграции (B2B)
    {
        id: '9', name: 'ХабИнтеграции', category: 'Интеграции', revenue: 1567890, deals: 43,
        avgCheck: 36462.09, region: 'Ош', clientType: 'B2B',
        monthlyRevenue: months.map((m) => ({ month: m, revenue: 90000 + Math.random() * 70000, deals: 2 + Math.floor(Math.random() * 5) })),
    },
    // Бишкек - Маркетинг (B2B)
    {
        id: '10', name: 'АвтоМаркет', category: 'Маркетинг', revenue: 2345670, deals: 156,
        avgCheck: 15036.35, region: 'Бишкек', clientType: 'B2B',
        monthlyRevenue: months.map((m) => ({ month: m, revenue: 140000 + Math.random() * 100000, deals: 9 + Math.floor(Math.random() * 12) })),
    },
    // Талас - Поддержка (B2C)
    {
        id: '11', name: 'СуппортЛайт', category: 'Поддержка', revenue: 876543, deals: 287,
        avgCheck: 3054.99, region: 'Талас', clientType: 'B2C',
        monthlyRevenue: months.map((m) => ({ month: m, revenue: 50000 + Math.random() * 40000, deals: 18 + Math.floor(Math.random() * 22) })),
    },
    // Каракол - Аналитика (B2C)
    {
        id: '12', name: 'АналитикаЛайт', category: 'Аналитика', revenue: 1234567, deals: 234,
        avgCheck: 5275.37, region: 'Каракол', clientType: 'B2C',
        monthlyRevenue: months.map((m) => ({ month: m, revenue: 70000 + Math.random() * 60000, deals: 14 + Math.floor(Math.random() * 18) })),
    },
];

export const crossSales: CrossSale[] = [
    // Бишкек паттерны
    { product1: 'УправоСофт Премиум', product2: 'АналитикаПро', count: 45 },
    { product1: 'УправоСофт Премиум', product2: 'ПортальПро', count: 29 },
    { product1: 'УправоСофт Премиум', product2: 'АвтоМаркет', count: 34 },
    { product1: 'АналитикаПро', product2: 'ДашбордДанных', count: 52 },
    { product1: 'ПортальПро', product2: 'ДашбордДанных', count: 33 },
    { product1: 'ПортальПро', product2: 'АналитикаПро', count: 28 },
    // Ош паттерны
    { product1: 'МаркетПакет', product2: 'ХабИнтеграции', count: 27 },
    { product1: 'ХабИнтеграции', product2: 'МаркетПакет', count: 19 },
    // Кросс-региональные
    { product1: 'УправоСофт Премиум', product2: 'СуппортСтол', count: 38 },
    { product1: 'МаркетПакет', product2: 'ОбучаемПлатформа', count: 23 },
    { product1: 'СуппортСтол', product2: 'УправоСофт Лайт', count: 41 },
    { product1: 'УправоСофт Лайт', product2: 'ОбучаемПлатформа', count: 22 },
    { product1: 'ОбучаемПлатформа', product2: 'СуппортЛайт', count: 18 },
    { product1: 'АналитикаЛайт', product2: 'ОбучаемПлатформа', count: 16 },
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
