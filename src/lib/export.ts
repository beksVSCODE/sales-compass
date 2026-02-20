/**
 * Утилиты для экспорта данных
 */

import { Product, CrossSale } from '@/data/mockData';

export interface ExportOptions {
    format: 'csv' | 'json' | 'xlsx';
    includeMetadata: boolean;
    filename?: string;
}

/**
 * Экспорт продуктов в CSV
 */
export function exportProductsToCSV(products: Product[], filename = 'products.csv'): void {
    const headers = ['ID', 'Название', 'Категория', 'Регион', 'Выручка (KGS)', 'Сделки', 'Средний чек (KGS)', 'Тип клиента'];

    const rows = products.map(p => [
        p.id,
        p.name,
        p.category,
        p.region,
        p.revenue.toLocaleString('ru-RU'),
        p.deals,
        p.avgCheck.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        p.clientType,
    ]);

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    downloadFile(csv, filename, 'text/csv;charset=utf-8;');
}

/**
 * Экспорт продуктов в JSON
 */
export function exportProductsToJSON(products: Product[], filename = 'products.json'): void {
    const data = {
        exportDate: new Date().toISOString(),
        totalProducts: products.length,
        totalRevenue: products.reduce((s, p) => s + p.revenue, 0),
        totalDeals: products.reduce((s, p) => s + p.deals, 0),
        products: products.map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            region: p.region,
            revenue: p.revenue,
            deals: p.deals,
            avgCheck: p.avgCheck,
            clientType: p.clientType,
        })),
    };

    const json = JSON.stringify(data, null, 2);
    downloadFile(json, filename, 'application/json;charset=utf-8;');
}

/**
 * Экспорт статистики в CSV
 */
export function exportStatsToCSV(products: Product[], filename = 'stats.csv'): void {
    const headers = ['Метрика', 'Значение'];

    const totalRevenue = products.reduce((s, p) => s + p.revenue, 0);
    const totalDeals = products.reduce((s, p) => s + p.deals, 0);
    const avgCheck = totalDeals > 0 ? totalRevenue / totalDeals : 0;

    // Топ продукты по выручке
    const topByRevenue = [...products].sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    // Топ продукты по сделкам
    const topByDeals = [...products].sort((a, b) => b.deals - a.deals).slice(0, 5);

    const rows = [
        ['', ''],
        ['ОБЩАЯ СТАТИСТИКА', ''],
        ['Всего продуктов', products.length],
        ['Общая выручка (KGS)', totalRevenue.toLocaleString('ru-RU')],
        ['Всего сделок', totalDeals],
        ['Средний чек (KGS)', avgCheck.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
        ['', ''],
        ['ТОП-5 ПО ВЫРУЧКЕ', ''],
        ...topByRevenue.map(p => [p.name, p.revenue.toLocaleString('ru-RU')]),
        ['', ''],
        ['ТОП-5 ПО СДЕЛКАМ', ''],
        ...topByDeals.map(p => [p.name, p.deals]),
    ];

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    downloadFile(csv, filename, 'text/csv;charset=utf-8;');
}

/**
 * Экспорт кросс-продаж в CSV
 */
export function exportCrossSalesToCSV(crossSales: CrossSale[], filename = 'cross-sales.csv'): void {
    const headers = ['Продукт 1', 'Продукт 2', 'Количество совместных сделок'];

    const rows = crossSales
        .sort((a, b) => b.count - a.count)
        .map(cs => [cs.product1, cs.product2, cs.count]);

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    downloadFile(csv, filename, 'text/csv;charset=utf-8;');
}

/**
 * Скачивание файла
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Генерация имени файла с датой
 */
export function generateFilename(prefix: string, format: 'csv' | 'json' = 'csv'): string {
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0];
    const timeStr = date.toTimeString().split(' ')[0].replace(/:/g, '-');
    return `${prefix}_${dateStr}_${timeStr}.${format}`;
}
